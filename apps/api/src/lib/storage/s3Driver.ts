import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl as presign } from '@aws-sdk/s3-request-presigner'
import type { StorageDriver } from './types'

export interface S3DriverConfig {
  bucket: string
  region: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  forcePathStyle: boolean
  // Endpoint used ONLY for signing browser-facing URLs (getSignedUrl /
  // getSignedUploadUrl). Defaults to `endpoint`. The two differ for MinIO
  // in local dev: `endpoint` is whatever's actually reachable from where
  // this process runs (a container talks to MinIO via its compose service
  // name; the host via localhost), but a signed URL's host is part of what
  // gets signed — a browser can never resolve a container-internal
  // address. Signing is a pure offline computation, so `publicEndpoint`
  // never needs to actually be reachable from here, only from the browser.
  // R2 has one real, universally resolvable endpoint, so the two are the
  // same value there.
  publicEndpoint?: string
  // Base URL for getPublicUrl. Defaults to `{publicEndpoint}/{bucket}`
  // (path-style), which is right for MinIO's anonymously-downloadable
  // bucket. R2 overrides this with its own pub-*.r2.dev domain.
  publicUrlBase?: string
}

export function createS3Driver(config: S3DriverConfig): StorageDriver {
  const credentials = {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  }

  const client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials,
    forcePathStyle: config.forcePathStyle,
  })

  const publicEndpoint = config.publicEndpoint ?? config.endpoint
  const publicClient =
    publicEndpoint === config.endpoint
      ? client
      : new S3Client({
          region: config.region,
          endpoint: publicEndpoint,
          credentials,
          forcePathStyle: config.forcePathStyle,
        })

  const publicUrlBase =
    config.publicUrlBase ?? `${publicEndpoint}/${config.bucket}`

  return {
    async putObject(key, body, contentType) {
      await client.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          // No ACL set, on purpose: R2 ignores S3 object ACLs entirely
          // (silent no-op — public access is controlled by bucket policy
          // instead). Setting one would work fine against MinIO and then
          // silently do nothing the moment this is pointed at R2.
        })
      )
    },

    async getSignedUrl(key, expiresInSeconds) {
      // R2 caps presigned URL expiry at 7 days (SigV4 limit) — not
      // enforced here since MinIO doesn't share that cap. A caller
      // requesting longer than that gets a silently-shorter-lived URL
      // once this is pointed at R2, not an error.
      return presign(
        publicClient,
        new GetObjectCommand({ Bucket: config.bucket, Key: key }),
        { expiresIn: expiresInSeconds }
      )
    },

    async getSignedUploadUrl(key, contentType, expiresInSeconds) {
      return presign(
        publicClient,
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          ContentType: contentType,
        }),
        { expiresIn: expiresInSeconds }
      )
    },

    getPublicUrl(key) {
      return `${publicUrlBase}/${key}`
    },

    async deleteObject(key) {
      await client.send(
        new DeleteObjectCommand({ Bucket: config.bucket, Key: key })
      )
    },

    async deleteObjectsByPrefix(prefix) {
      // Lifecycle rules and storage classes differ between R2 and MinIO —
      // relevant later for the `archived` engagement retention tier, not
      // to this bulk-delete path, which just lists-then-deletes either way.
      let continuationToken: string | undefined
      do {
        const page = await client.send(
          new ListObjectsV2Command({
            Bucket: config.bucket,
            Prefix: prefix,
            ContinuationToken: continuationToken,
          })
        )
        const objects = (page.Contents ?? [])
          .map((o) => o.Key)
          .filter((key): key is string => Boolean(key))
          .map((Key) => ({ Key }))

        if (objects.length > 0) {
          await client.send(
            new DeleteObjectsCommand({
              Bucket: config.bucket,
              Delete: { Objects: objects },
            })
          )
        }

        continuationToken = page.IsTruncated
          ? page.NextContinuationToken
          : undefined
      } while (continuationToken)
    },
  }
}
