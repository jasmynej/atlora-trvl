// In-memory, per-process. Deliberate for this milestone: the auth system is
// explicitly pre-production and single-instance (§3 of the handoff), and a
// Redis dependency to rate-limit one login route isn't worth it yet. Revisit
// if the API ever runs as more than one process — a shared store would be
// needed for the limit to hold across instances.

interface Bucket {
  count: number
  windowStart: number
}

const buckets = new Map<string, Bucket>()

export interface RateLimitOptions {
  windowMs: number
  max: number
}

/**
 * Fixed-window limiter. Returns true if `key` is currently allowed to
 * proceed, and records the attempt either way. Reusable for any
 * unauthenticated route, not just platform login — the key is caller-chosen
 * (e.g. `login:ip:<ip>` and `login:email:<email>` checked together).
 */
export function checkRateLimit(key: string, options: RateLimitOptions): boolean {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now - existing.windowStart >= options.windowMs) {
    buckets.set(key, { count: 1, windowStart: now })
    return true
  }

  existing.count += 1
  return existing.count <= options.max
}
