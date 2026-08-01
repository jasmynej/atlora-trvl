import { trpc } from './trpc'

export function useUpload() {
  const getUploadUrl = trpc.storage.getUploadUrl.useMutation()

  async function upload(file: File, key: string): Promise<string> {
    const { uploadUrl, publicUrl } = await getUploadUrl.mutateAsync({
      key,
      contentType: file.type,
    })

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)

    return publicUrl
  }

  return { upload, isPending: getUploadUrl.isPending }
}
