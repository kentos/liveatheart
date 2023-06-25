import { z } from 'zod'
import { createAccount } from '../../features/auth/createAccount'
import { publicProcedure, router } from '../trpc'
import { createAuthToken } from '../../features/auth/tokens'

export default router({
  newAccount: publicProcedure.mutation(async () => {
    return createAccount()
  }),

  renewAuthToken: publicProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return createAuthToken(input.refreshToken)
    }),
})
