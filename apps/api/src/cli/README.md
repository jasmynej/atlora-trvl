# `platformUser` CLI

`src/cli/platformUser.ts` is the **only** way to create or manage `platform_users` rows. There is no API route for it, and there never should be — see the comment at the top of the file (§3 of the platform admin handoff: "if any route can create a platform user, that route is a hole"). Platform admins/editors are provisioned out-of-band by whoever operates the platform, not through the product.

It has two commands: `create` and `reset-password`.

## Running it

Always run it through the workspace script, from anywhere in the repo — this loads `apps/api/.env` via `--env-file` and points it at the same database the API server uses:

```bash
pnpm --filter @atlora/api cli:platform-user <command> [...args]
```

Running the file directly with `tsx` works too, but you'd need to pass `--env-file apps/api/.env` yourself and `cd` into `apps/api` first, so prefer the `pnpm --filter` form above.

## `create`

Creates a new platform user.

```bash
pnpm --filter @atlora/api cli:platform-user create \
  --email a@b.com \
  --password '...' \
  --name "Jane Doe" \
  --role platform_admin
```

| Flag | Required | Notes |
|---|---|---|
| `--email` | yes | Normalized (trimmed, lowercased) before lookup/insert. Must not already exist. |
| `--password` | yes | 12 characters minimum. Hashed with the same `hashPassword` the login route uses ([`apps/api/src/lib/auth/platformAuth.ts`](../lib/auth/platformAuth.ts)) — there's one password-hashing path in the app, and this is it. |
| `--name` | yes | Display name. |
| `--role` | yes | `platform_admin` or `platform_editor`. `platform_editor` is catalog-only — no agency or billing access. |

The new user is created with `status: active`. On success it prints the new user's email, role, and id. It refuses to run if a user with that email already exists.

## `reset-password`

Resets an existing platform user's password.

```bash
pnpm --filter @atlora/api cli:platform-user reset-password \
  --email a@b.com \
  --password 'newPassword...'
```

| Flag | Required | Notes |
|---|---|---|
| `--email` | yes | Normalized the same way as `create`. Must match an existing user. |
| `--password` | yes | 12 characters minimum. |

This also clears `failedLoginCount` and `lockedUntil`, so it doubles as the way to unlock an account that's been locked out by repeated failed logins (see `LOGIN_LOCKOUT_THRESHOLD` in `platformAuth.ts`) — it doesn't just change the password.

## Notes

- Both commands exit `0` on success and `1` on error, printing the error message to stderr — safe to script/CI, but there's currently no non-interactive "check if a user exists" mode; `create` just fails loudly if the email is taken.
- There's no `delete` or `list` command yet. Use Drizzle Studio (`pnpm db:studio`) or a direct query against `platform_users` for anything beyond create/reset-password.
- Roles and statuses are enums at the DB level (`PlatformRole`: `platform_admin` | `platform_editor`; `UserStatus`: `active` | `suspended`) — the CLI's own validation for `--role` mirrors `PLATFORM_ROLES` in the script, so if a role is ever added to the schema it needs to be added there too.
