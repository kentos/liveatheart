import { publicProcedure, router } from './trpc'
import news from './routers/news'
import deals from './routers/deals'
import artists from './routers/artists'
import user from './routers/user'
import auth from './routers/auth'

export const appRouter = router({
  me: publicProcedure.query(() => 'Hello World!'),
  news,
  deals,
  artists,
  user,
  auth,
})

export type AppRouter = typeof appRouter
