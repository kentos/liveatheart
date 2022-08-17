import { FastifyInstance } from '@heja/shared/fastify'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/features',
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
