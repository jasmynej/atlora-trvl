// Narrow interface every procedure depends on — never the S3 client
// directly (mirrors the auth module's pattern in lib/auth). Driver
// selection is an env var (STORAGE_DRIVER); see ./index.ts.
//
// putObject / getSignedUrl / deleteObject / deleteObjectsByPrefix are the
// four methods the Docker handoff's Milestone 4 names explicitly.
// getSignedUploadUrl and getPublicUrl are additions needed to cover what
// this app already does (a browser-direct upload flow, and public media
// URLs) — both still go through the same driver, never a raw S3 client.
export interface StorageDriver {
  putObject(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType: string
  ): Promise<void>

  // Signed GET — private/consent-gated reads (Epic D: a traveler document
  // only gets one of these after consent resolution). Not used by any
  // procedure yet; the guarantee this module exists to make enforceable is
  // that when Epic D lands, there is exactly one place that mints one.
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>

  // Signed PUT — lets the browser upload directly to the bucket without
  // the file passing through the API.
  getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresInSeconds: number
  ): Promise<string>

  // For objects the bucket policy already allows anonymous GET on (public
  // destination/POI media) — plain URL construction, no signing.
  getPublicUrl(key: string): string

  deleteObject(key: string): Promise<void>

  // No bulk "delete by prefix" primitive in S3 — implementations list
  // then batch-delete. Not used by any procedure yet; anticipates
  // per-engagement document cleanup.
  deleteObjectsByPrefix(prefix: string): Promise<void>
}
