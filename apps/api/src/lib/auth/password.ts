import { Algorithm, hash, verify } from '@node-rs/argon2'

// argon2id explicitly, not the library default left implicit — this is the
// highest-privilege password path in the system (§3 of the platform admin
// handoff). Store only the returned PHC-format hash; never the password or
// a reversible encoding of it.
const HASH_OPTIONS = { algorithm: Algorithm.Argon2id }

export function hashPassword(password: string): Promise<string> {
  return hash(password, HASH_OPTIONS)
}

export function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return verify(passwordHash, password, HASH_OPTIONS)
}
