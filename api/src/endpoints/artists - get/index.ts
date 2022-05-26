import { FastifyInstance } from '@heja/shared/fastify'

import artistsMockData from '../../data/artists.json'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/artists',
    handler: async () => {
      return artistsMockData
    },
  })
}

export default handler
