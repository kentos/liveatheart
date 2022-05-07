import { FastifyInstance } from '@heja/shared/fastify'
import { getAllNews } from '../../features/news'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/news',
    handler: async () => {
      return getAllNews()
    },
  })
}

export default handler