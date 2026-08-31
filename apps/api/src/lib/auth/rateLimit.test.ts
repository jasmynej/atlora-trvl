import { describe, expect, it } from 'vitest'
import { checkRateLimit } from './rateLimit'

describe('checkRateLimit', () => {
  it('allows up to max attempts in a window, then blocks', () => {
    const key = `test-${crypto.randomUUID()}`
    const options = { windowMs: 60_000, max: 3 }

    expect(checkRateLimit(key, options)).toBe(true)
    expect(checkRateLimit(key, options)).toBe(true)
    expect(checkRateLimit(key, options)).toBe(true)
    expect(checkRateLimit(key, options)).toBe(false)
  })

  it('tracks distinct keys independently', () => {
    const options = { windowMs: 60_000, max: 1 }
    const keyA = `test-a-${crypto.randomUUID()}`
    const keyB = `test-b-${crypto.randomUUID()}`

    expect(checkRateLimit(keyA, options)).toBe(true)
    expect(checkRateLimit(keyA, options)).toBe(false)
    // keyB has its own budget, unaffected by keyA being exhausted.
    expect(checkRateLimit(keyB, options)).toBe(true)
  })

  it('resets once the window elapses', async () => {
    const key = `test-${crypto.randomUUID()}`
    const options = { windowMs: 20, max: 1 }

    expect(checkRateLimit(key, options)).toBe(true)
    expect(checkRateLimit(key, options)).toBe(false)

    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(checkRateLimit(key, options)).toBe(true)
  })
})
