import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'
import authenticatedEndpoint from '../../lib/authenticateEndpoint'

async function getProfile(userId: string) {
  const result = await collection<User>('users').findOne({ _id: userId })
  return result
}

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/profile',
    preHandler: [authenticatedEndpoint],
    handler: async (req: FastifyRequest) => {
      return getProfile(req.currentUser._id)
    },
  })
}

export default handler
