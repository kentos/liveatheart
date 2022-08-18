import { FastifyInstance } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'
import _ from 'lodash'

function omitSpotify(a: Artist) {
  return a.spotify?.length === 0 ? _.omit(a, 'spotify') : a
}

function omitYoutube(a: Artist) {
  return a.youtube?.length === 0 ? _.omit(a, 'youtube') : a
}

function cleanCategories(a: Artist) {
  return {
    ...a,
    genre: a.categories
      ?.filter((c) => ![c.name, c.slug].includes('artists-2022'))
      .map((c) => c.name.replace('-', ' '))
      .join(', '),
  }
}

const handleArtist = _.flow(omitSpotify, omitYoutube, cleanCategories)

const dayMap: Record<string, string> = {
  '31/08/2022': 'wednesday',
  '01/09/2022': 'thursday',
  '02/09/2022': 'friday',
  '03/09/2022': 'saturday',
}

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/artists',
    handler: async () => {
      const [artists, events] = await Promise.all([
        collection<Artist>('artists')
          .find({ deletedAt: { $exists: false } })
          .toArray(),
        collection<LAHEvent>('events')
          .find({ artistid: { $exists: true }, deletedAt: { $exists: false } })
          .toArray(),
      ])
      return artists
        .map((a) => ({
          ...a,
          slots: events
            .filter((e) => e.artistid.equals(a._id))
            .map((e) => ({
              ...e,
              day: dayMap[e.date],
            })),
        }))
        .map(handleArtist)
    },
  })
}

export default handler
