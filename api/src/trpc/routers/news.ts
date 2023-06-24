import { z } from 'zod'
import {
  getAllNews,
  heartArticle,
  removeHeartArticle,
} from '../../features/news'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import { toObjectId } from '@heja/shared/mongodb'
import { TRPCError } from '@trpc/server'

export default router({
  getNews: publicProcedure.query(async () => {
    return getAllNews()
  }),

  setHeart: protectedProcedure
    .input(z.object({ articleId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.requester) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return heartArticle(toObjectId(input.articleId), ctx.requester)
    }),
  removeHeart: protectedProcedure
    .input(z.object({ articleId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.requester) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return removeHeartArticle(toObjectId(input.articleId), ctx.requester)
    }),
})
