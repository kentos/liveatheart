import { FastifyInstance } from '@heja/shared/fastify'
import authenticatedEndpoint from '../../lib/authenticateEndpoint'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/features',
    preHandler: [authenticatedEndpoint],
    handler: async () => {
      return {
        artists: true,
        myArtists: false,
        map: true,
        schedule: true,
        news: true,
        deals: false,
      }
    },
  })
}

export default handler
