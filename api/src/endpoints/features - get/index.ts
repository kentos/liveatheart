import { FastifyInstance } from '@heja/shared/fastify'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/features',
    handler: async () => {
      return {
        artists: true,
        schedule: false,
        news: true,
        deals: true,
      }
    },
  })
}

export default handler
