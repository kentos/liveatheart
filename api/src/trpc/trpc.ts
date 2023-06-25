import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'

type Context = {
  requester: string
}

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

const isAuthed = t.middleware(async (opts) => {
  const { ctx } = opts
  if (!ctx.requester) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return opts.next({
    ctx: {
      requester: ctx.requester,
    },
  })
})

export const middleware = t.middleware
export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
