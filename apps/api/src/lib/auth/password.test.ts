import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from './password'

describe('password hashing', () => {
  it('round-trips a correct password', async () => {
    const hash = await hashPassword('correct-horse-battery-staple')
    await expect(verifyPassword(hash, 'correct-horse-battery-staple')).resolves.toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('correct-horse-battery-staple')
    await expect(verifyPassword(hash, 'wrong-password')).resolves.toBe(false)
  })

  it('never stores the password itself in the hash', async () => {
    const hash = await hashPassword('correct-horse-battery-staple')
    expect(hash).not.toContain('correct-horse-battery-staple')
  })

  it('is argon2id (PHC format tag)', async () => {
    const hash = await hashPassword('correct-horse-battery-staple')
    expect(hash.startsWith('$argon2id$')).toBe(true)
  })

  it('salts each hash independently, even for the same password', async () => {
    const [a, b] = await Promise.all([hashPassword('same-password'), hashPassword('same-password')])
    expect(a).not.toBe(b)
  })
})
