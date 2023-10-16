import { router } from './trpc'
import news from './routers/news'
import deals from './routers/deals'
import artists from './routers/artists'
import user from './routers/user'
import auth from './routers/auth'
import program from './routers/program'

export const appRouter = router({
  news,
  deals,
  artists,
  user,
  auth,
  program,
})

export type AppRouter = typeof appRouter
