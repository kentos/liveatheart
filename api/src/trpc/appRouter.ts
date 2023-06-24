import { publicProcedure, router } from './trpc'
import news from './routers/news'

export const appRouter = router({
  me: publicProcedure.query(() => 'Hello World!'),
  news,
})

export type AppRouter = typeof appRouter
