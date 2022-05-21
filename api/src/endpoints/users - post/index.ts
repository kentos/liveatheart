import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/users',
    schema: {
      body: {
        type: 'object',
        properties: {
          _id: {type:'string'},
        }
      }
    },
    handler: async (req: FastifyRequest<{Body:{_id:string;}}>) => {
      await collection<User>('users').insertOne({
        _id: req.body._id,
        firstName: null,
        lastName: null,
      })
      return {}
    },
  })
}

export default handler