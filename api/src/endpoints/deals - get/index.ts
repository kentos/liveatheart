import { FastifyInstance } from '@heja/shared/fastify'
import { getAllDeals } from '../../features/deals'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/deals',
    handler: async () => {
      return getAllDeals()
    },
  })
}

export default handler
