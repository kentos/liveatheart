import { collection } from '@heja/shared/mongodb'
import { protectedProcedure, router } from '../trpc'
import { User } from '../../features/users/types'
import { TRPCError } from '@trpc/server'

export default router({
  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    const user = await collection<User>('users').findOne({ _id: ctx.requester })
    console.log(user)
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return user.favorites?.map((f) => f._id.toString()) ?? []
  }),
})
