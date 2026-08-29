import { platformProcedure, router } from '../trpc'

export const platformUsersRouter = router({
  me: platformProcedure.query(({ ctx }) => ctx.platformUser),
})
