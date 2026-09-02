import * as React from 'react'
import { trpc } from './trpc'

export interface PlatformUser {
  id: string
  email: string
  name: string
  role: 'platform_admin' | 'platform_editor'
}

interface AuthContextValue {
  user: PlatformUser | null | undefined // undefined = still loading
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function PlatformAuthProvider({ children }: { children: React.ReactNode }) {
  const utils = trpc.useUtils()

  // A missing/expired/revoked session is not an application error — it's
  // just "signed out" — so this deliberately doesn't retry or surface an
  // error UI on 401.
  const meQuery = trpc.platform.auth.me.useQuery(undefined, { retry: false })

  const loginMutation = trpc.platform.auth.login.useMutation({
    onSuccess: (user) => utils.platform.auth.me.setData(undefined, user),
  })
  const logoutMutation = trpc.platform.auth.logout.useMutation({
    // `undefined`, not `null` — the `me` query never resolves to null (an
    // expired/missing session makes it error instead), so `undefined` is
    // the "no cached user" value that matches its actual type. The `user`
    // derivation below treats "not loading, no data" as signed out either
    // way.
    onSuccess: () => utils.platform.auth.me.setData(undefined, undefined),
  })

  const login = React.useCallback(
    async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password })
    },
    [loginMutation]
  )

  const logout = React.useCallback(async () => {
    await logoutMutation.mutateAsync()
  }, [logoutMutation])

  const user = meQuery.isLoading ? undefined : (meQuery.data ?? null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function usePlatformAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('usePlatformAuth must be used within a PlatformAuthProvider')
  return ctx
}
