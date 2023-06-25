import getenv from 'getenv'
import jwt from 'jsonwebtoken'
import { AuthToken } from '../features/auth/types'
import { TRPCError } from '@trpc/server'

export default function verifyAuthtoken(token: string) {
  try {
    return jwt.verify(token, getenv.string('AUTH_SECRET'), {
      algorithms: ['HS512'],
    }) as AuthToken
  } catch (e: unknown) {
    if (e instanceof jwt.TokenExpiredError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })
    }
  }
}
