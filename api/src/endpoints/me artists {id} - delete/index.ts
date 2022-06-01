import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'DELETE',
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
    handler: async (req: FastifyRequest<{ Params: { id: string } }>) => {
      const { id } = req.params
      await collection<User>('users').updateOne(
        { _id: req.currentUser._id },
        { $pull: { favorites: { _id: id } } },
      )
      return ''
    },
  })
}

export default handler
