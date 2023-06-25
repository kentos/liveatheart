import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'
import authenticatedEndpoint from '../../lib/authenticateEndpoint'
import { User } from '../../features/users/types'

async function updateProfile(
  userId: string,
  updates: {
    firstName?: string
    lastName?: string
    email?: string
  },
) {
  if (!updates.firstName && !updates.lastName && !updates.email) {
    throw new Error('Nothing to update')
  }
  const result = await collection<User>('users').findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        ...(updates.firstName && { firstName: updates.firstName }),
        ...(updates.lastName && { lastName: updates.lastName }),
        ...(updates.email && { email: updates.email }),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' },
  )
  if (result.ok) {
    return result.value
  }
  throw new Error('Could not update profile')
}

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'PUT',
    url: '/profile',
    preHandler: [authenticatedEndpoint],
    handler: async (
      req: FastifyRequest<{
        Body: { firstName?: string; lastName?: string; email?: string }
      }>,
    ) => {
      return updateProfile(req.currentUser._id, req.body)
    },
  })
}

export default handler
