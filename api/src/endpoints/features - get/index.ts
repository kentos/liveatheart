import { FastifyInstance } from '@heja/shared/fastify'
import { getAllNews } from '../../features/news'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/features',
    handler: async () => {
      return {
        artists: false,
        schedule: false,
        news: true,
        deals: true,
      }
    },
  })
}

export default handler