import { db, mediaAttachments, mediaEntityTypeEnum } from '@atlora/db'
import type { AttachMediaInput } from '@atlora/types'
import { and, eq } from 'drizzle-orm'

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]
type MediaEntityType = (typeof mediaEntityTypeEnum.enumValues)[number]

/**
 * Bulk-inserts media attachments for an entity. If any attachment has
 * role "hero", any existing hero attachment for that entity is deleted
 * first — the DB unique constraint alone allows two different media rows
 * to both claim "hero" for the same entity, so the single-hero invariant
 * is enforced here instead.
 */
export async function replaceHeroSafe(
  tx: Tx | typeof db,
  entityType: MediaEntityType,
  entityId: string,
  attachments: AttachMediaInput[]
) {
  if (attachments.length === 0) return []

  if (attachments.some((a) => a.role === 'hero')) {
    await tx
      .delete(mediaAttachments)
      .where(
        and(
          eq(mediaAttachments.entityType, entityType),
          eq(mediaAttachments.entityId, entityId),
          eq(mediaAttachments.role, 'hero')
        )
      )
  }

  return tx
    .insert(mediaAttachments)
    .values(attachments.map((a) => ({ ...a, entityType, entityId })))
    .returning()
}
