import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { createUser } from '../../features/users/create'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/users',
    schema: {
      body: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
        },
      },
    },
    handler: async (req: FastifyRequest<{ Body: { _id: string } }>) => {
      await createUser({ _id: req.body._id })
      return {}
    },
  })
}

export default handler
