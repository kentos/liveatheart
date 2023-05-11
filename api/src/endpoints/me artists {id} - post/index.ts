import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'
import authenticatedEndpoint from '../../lib/authenticateEndpoint'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/me/artists/:id',
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
    },
    preHandler: [authenticatedEndpoint],
    handler: async (req: FastifyRequest<{ Params: { id: string } }>) => {
      const { id } = req.params
      await collection<User>('users').updateOne(
        { _id: req.currentUser._id, 'favorites._id': { $ne: id } },
        { $push: { favorites: { _id: id, createdAt: new Date() } } },
      )
      return ''
    },
  })
}

export default handler
