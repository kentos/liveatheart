import { FastifyInstance } from '@heja/shared/fastify'
import getImageHandler from './getImageHandler'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/image',
    schema: {
      querystring: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string' },
          type: { type: 'string', enum: ['gray', 'thumb'] },
        },
      },
      response: {
        200: {
          type: 'string',
        },
      },
    },
    handler: getImageHandler,
  })
}

export default handler
