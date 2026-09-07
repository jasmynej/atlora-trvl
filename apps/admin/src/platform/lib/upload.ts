import type { MediaUploadValue } from '@atlora/ui'
import { platformTrpc } from './trpc'

function randomKey(prefix: string, fileName: string) {
  const ext = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : ''
  return `${prefix}/${crypto.randomUUID()}${ext}`
}

// Mirrors apps/admin/src/lib/upload.ts, but scoped to the platform tRPC
// client and extended to also create the `media` row — catalog entities
// attach media by `mediaId`, not by raw upload data (see @atlora/types'
// AttachMediaInputSchema), so an upload isn't usable until that row exists.
export function usePlatformMediaUpload(keyPrefix: string) {
  const getUploadUrl = platformTrpc.storage.getUploadUrl.useMutation()
  const createMedia = platformTrpc.media.create.useMutation()

  async function upload(file: File): Promise<MediaUploadValue> {
    const key = randomKey(keyPrefix, file.name)
    const { uploadUrl, publicUrl } = await getUploadUrl.mutateAsync({ key, contentType: file.type })

    const res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)

    const created = await createMedia.mutateAsync({
      key,
      url: publicUrl,
      altText: null,
      width: null,
      height: null,
      mimeType: file.type,
    })

    return { mediaId: created!.id, url: created!.url, altText: created!.altText }
  }

  return { upload }
}
