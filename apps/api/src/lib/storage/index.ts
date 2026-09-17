import { createS3Driver } from './s3Driver'
import type { StorageDriver } from './types'

export type { StorageDriver } from './types'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

// One S3-compatible driver implementation serves both MinIO (local dev)
// and R2 (real/hosted) — they differ only in endpoint and credentials.
// STORAGE_DRIVER picks which config to build; nothing above this module
// ever needs to know which one is active.
function loadDriver(): StorageDriver {
  const driver = process.env.STORAGE_DRIVER ?? 'r2'

  switch (driver) {
    case 'minio':
      return createS3Driver({
        bucket: requireEnv('MINIO_BUCKET_NAME'),
        region: 'us-east-1', // ignored by MinIO; the SDK requires a value
        endpoint: requireEnv('MINIO_ENDPOINT'),
        publicEndpoint: process.env.MINIO_PUBLIC_ENDPOINT,
        accessKeyId: requireEnv('MINIO_ACCESS_KEY_ID'),
        secretAccessKey: requireEnv('MINIO_SECRET_ACCESS_KEY'),
        forcePathStyle: true,
      })

    case 'r2':
      return createS3Driver({
        bucket: requireEnv('R2_BUCKET_NAME'),
        region: 'auto',
        endpoint: `https://${requireEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
        accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
        secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
        forcePathStyle: false,
        publicUrlBase: requireEnv('R2_PUBLIC_URL'),
      })

    default:
      throw new Error(
        `Unknown STORAGE_DRIVER "${driver}" — expected "r2" or "minio"`
      )
  }
}

export const storage: StorageDriver = loadDriver()
