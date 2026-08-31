// The only account-creation path for platform_users (§3 of the platform
// admin handoff — "if any route can create a platform user, that route is a
// hole"). Run via:
//
//   pnpm --filter @atlora/api cli:platform-user create --email a@b.com --password '...' --name "Jane Doe" --role platform_admin
//   pnpm --filter @atlora/api cli:platform-user reset-password --email a@b.com --password '...'
//
// Lives in apps/api (not packages/db) because it needs to hash the password
// through the same module the login route uses — there is exactly one
// place password hashing happens, per §3's "keep the swap-back seam clean."
import { db, platformUsers } from '@atlora/db'
import { eq } from 'drizzle-orm'
import { hashPlatformPassword, normalizePlatformEmail } from '../lib/auth/platformAuth'

const PLATFORM_ROLES = ['platform_admin', 'platform_editor'] as const

function readArg(name: string): string | undefined {
  const flag = `--${name}`
  const index = process.argv.indexOf(flag)
  return index === -1 ? undefined : process.argv[index + 1]
}

async function createPlatformUser() {
  const email = readArg('email')
  const password = readArg('password')
  const name = readArg('name')
  const role = readArg('role')

  if (!email || !password || !name || !role) {
    throw new Error('Usage: create --email <email> --password <password> --name <name> --role <platform_admin|platform_editor>')
  }
  if (!(PLATFORM_ROLES as readonly string[]).includes(role)) {
    throw new Error(`--role must be one of: ${PLATFORM_ROLES.join(', ')}`)
  }
  if (password.length < 12) {
    throw new Error('--password must be at least 12 characters')
  }

  const normalizedEmail = normalizePlatformEmail(email)
  const existing = await db.query.platformUsers.findFirst({ where: { email: normalizedEmail } })
  if (existing) {
    throw new Error(`A platform user with email ${normalizedEmail} already exists (id: ${existing.id})`)
  }

  const passwordHash = await hashPlatformPassword(password)
  const [user] = await db
    .insert(platformUsers)
    .values({
      email: normalizedEmail,
      passwordHash,
      name,
      role: role as (typeof PLATFORM_ROLES)[number],
      status: 'active',
    })
    .returning({ id: platformUsers.id, email: platformUsers.email, role: platformUsers.role })

  console.log(`Created platform user ${user!.email} (${user!.role}), id: ${user!.id}`)
}

async function resetPlatformPassword() {
  const email = readArg('email')
  const password = readArg('password')

  if (!email || !password) {
    throw new Error('Usage: reset-password --email <email> --password <newPassword>')
  }
  if (password.length < 12) {
    throw new Error('--password must be at least 12 characters')
  }

  const normalizedEmail = normalizePlatformEmail(email)
  const passwordHash = await hashPlatformPassword(password)

  const [user] = await db
    .update(platformUsers)
    .set({ passwordHash, failedLoginCount: 0, lockedUntil: null })
    .where(eq(platformUsers.email, normalizedEmail))
    .returning({ id: platformUsers.id, email: platformUsers.email })

  if (!user) {
    throw new Error(`No platform user found with email ${normalizedEmail}`)
  }

  console.log(`Password reset for ${user.email} (id: ${user.id})`)
}

async function main() {
  const command = process.argv[2]

  if (command === 'create') {
    await createPlatformUser()
  } else if (command === 'reset-password') {
    await resetPlatformPassword()
  } else {
    throw new Error('Usage: platformUser.ts <create|reset-password> [...args]')
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  })
