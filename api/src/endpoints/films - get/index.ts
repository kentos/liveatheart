import { FastifyInstance } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'
import { Film } from '../../features/types'
import { LAHEvent } from '../../features/artists/types'

const dayMap: Record<string, string> = {
  '31/08/2022': 'wednesday',
  '01/09/2022': 'thursday',
  '02/09/2022': 'friday',
  '03/09/2022': 'saturday',
}

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/films',
    handler: async () => {
      const [films, events] = await Promise.all([
        collection<Film>('films')
          .find({ deletedAt: { $exists: false } })
          .toArray(),
        collection<LAHEvent>('events')
          .find({ filmid: { $exists: true }, deletedAt: { $exists: false } })
          .toArray(),
      ])
      return films.map((a) => ({
        ...a,
        slots: events
          .filter((e) => e.filmid!.equals(a._id))
          .map((e) => ({
            ...e,
            day: dayMap[e.date],
          })),
      }))
    },
  })
}

export default handler
