import { sign, verify } from 'jsonwebtoken'
import getenv from 'getenv'
import { RefreshToken } from './types'
import { ulid } from 'ulid'
import { collection } from '@heja/shared/mongodb'
import { User } from '../users/types'
import { TRPCError } from '@trpc/server'

const REFRESH_SECRET = getenv.string('REFRESH_SECRET')
const AUTH_SECRET = getenv.string('AUTH_SECRET')

export function createRefreshToken(userId: string) {
  const payload: RefreshToken = { _id: userId, uuid: ulid() }
  const refreshToken = sign(payload, REFRESH_SECRET, {
    algorithm: 'HS512',
    issuer: 'lah-api',
    audience: 'lah-client',
    expiresIn: '1y',
  })
  return { refreshToken }
}

export async function createAuthToken(refreshToken: string) {
  const verifiedPayload = verify(refreshToken, REFRESH_SECRET, {
    algorithms: ['HS512'],
    issuer: 'lah-api',
    audience: 'lah-client',
  }) as RefreshToken

  const existingUser = await collection<User>('users').findOne({
    refreshTokenUuid: verifiedPayload.uuid,
  })
  if (!existingUser) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'User not found',
    })
  }

  const authToken = sign(
    {
      _id: verifiedPayload._id,
      ...(existingUser.isAdmin && { isAdmin: true }),
    },
    AUTH_SECRET,
    {
      algorithm: 'HS512',
      issuer: 'lah-api',
      audience: 'lah-client',
      expiresIn: '10m',
    },
  )
  return { authToken }
}
