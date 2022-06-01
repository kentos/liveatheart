import { FastifyInstance } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/artists',
    handler: async () => {
      const artists = await collection<Artist>('artists').find({}).toArray()
      return artists.map((a) => ({
        _id: a._id,
        name: a.name,
        image: a.image,
        genre: a.categories
          ?.filter((c) => c.name !== 'artists-2022')
          .map((c) => c.name.replace('-', ' '))
          .join(', '),
        city: '?',
        country: '?',
        description: a.description,
        slots: [],
      }))
    },
  })
}

export default handler
