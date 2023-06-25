import { inferAsyncReturnType } from '@trpc/server'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import verifyAuthtoken from '../lib/verifyAuthtoken'

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  // await new Promise((res) => setTimeout(res, 1500))
  if (req.headers.authorization) {
    console.log('HEADERS', req.headers.authorization)
    const { authorization } = req.headers
    const requester = verifyAuthtoken(authorization.substring(7))
    if (!requester) {
      throw new Error('Invalid token')
    }
    return { req, res, requester: requester._id }
  }

  return { req, res, requester: null }
}
export type Context = inferAsyncReturnType<typeof createContext>
