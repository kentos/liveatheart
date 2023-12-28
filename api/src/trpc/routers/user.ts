import { collection } from '@heja/shared/mongodb'
import { protectedProcedure, router } from '../trpc'
import { User } from '../../features/users/types'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { ping } from '../../features/users/ping'
import { getProfile, updateProfile } from '../../features/users/profile'

export default router({
  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    const user = await collection<User>('users').findOne({ _id: ctx.requester })
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return user.favorites?.map((f) => f._id.toString()) ?? []
  }),

  ping: protectedProcedure
    .input(
      z.object({
        os: z.string(),
        osVersion: z.string(),
        timestamp: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ping({
        user: ctx.requester,
        os: input.os,
        osVersion: input.osVersion,
        timestamp: input.timestamp,
      })
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getProfile(ctx.requester)
    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return profile
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return updateProfile(ctx.requester, input)
    }),

  getFeatures: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx }) => {
      const user = await collection<User>('users').findOne({
        _id: ctx.requester,
      })
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }
      const features = {
        showHeartbeat: false,
        hidden: {
          artists: true,
          schedule: true,
          venues: true,
          map: true,
          deals: true,
        },
      }
      return features
    }),

  deleteProfile: protectedProcedure.mutation(async ({ ctx }) => {
    await collection<User>('users').updateOne(
      { _id: ctx.requester },
      { $set: { deleted: true } },
    )
  }),
})
