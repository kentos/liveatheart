import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'
import { NotAllowed } from '@heja/shared/errors'
import getenv from 'getenv'
import { sign, verify, decode } from 'jsonwebtoken'
import { ulid } from 'ulid'
import { createUser } from '../../features/users/create'
import { updateUser } from '../../features/users/update'

const REFRESH_SECRET = getenv.string('REFRESH_SECRET')
const AUTH_SECRET = getenv.string('AUTH_SECRET')

function createRefreshToken(userId: string) {
  const payload: RefreshToken = { _id: userId, uuid: ulid() }
  const refreshToken = sign(payload, REFRESH_SECRET, {
    algorithm: 'HS512',
    issuer: 'lah-api',
    audience: 'lah-client',
    expiresIn: '1y',
  })
  return { refreshToken }
}

async function createAuthToken(refreshToken: string) {
  const verifiedPayload = verify(refreshToken, REFRESH_SECRET, {
    algorithms: ['HS512'],
    issuer: 'lah-api',
    audience: 'lah-client',
  }) as RefreshToken

  const existingUser = await collection<User>('users').findOne({
    refreshTokenUuid: verifiedPayload.uuid,
  })
  if (!existingUser) {
    throw new NotAllowed('Uuid invalid')
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

async function getUniqueId(): Promise<string> {
  const newId = ulid()
  const result = await collection<User>('users').findOne({ _id: newId })
  if (result) {
    return getUniqueId()
  }
  return newId
}

async function createAccount() {
  const newId = await getUniqueId()
  const newUser = await createUser({ _id: newId })

  const { refreshToken } = createRefreshToken(newUser._id)
  const { uuid } = decode(refreshToken) as RefreshToken
  await updateUser(newUser._id, { refreshTokenUuid: uuid })
  return { refreshToken }
}

async function handler(fastify: FastifyInstance) {
  fastify.route({
    schema: {
      body: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string' },
          newAccount: { type: 'string' },
        },
      },
    },
    method: 'POST',
    url: '/auth',
    handler: async (
      req: FastifyRequest<{
        Body: { refreshToken?: string; newAccount?: boolean }
      }>,
    ) => {
      if (req.body.refreshToken) {
        return createAuthToken(req.body.refreshToken)
      }
      if (req.body.newAccount) {
        return createAccount()
      }
      throw new Error('Unknown action')
    },
  })
}

export default handler
