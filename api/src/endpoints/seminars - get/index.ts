import { FastifyInstance } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'

const dayMap: Record<string, string> = {
  '31/08/2022': 'wednesday',
  '01/09/2022': 'thursday',
  '02/09/2022': 'friday',
  '03/09/2022': 'saturday',
}

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/seminars',
    handler: async () => {
      const [seminars, events] = await Promise.all([
        collection<Seminar>('seminars')
          .find({ deletedAt: { $exists: false } })
          .toArray(),
        collection<LAHEvent>('events')
          .find({ seminarid: { $exists: true }, deletedAt: { $exists: false } })
          .toArray(),
      ])
      return seminars.map((a) => ({
        ...a,
        slots: events
          .filter((e) => e.seminarid!.equals(a._id))
          .map((e) => ({
            ...e,
            day: dayMap[e.date],
          })),
      }))
    },
  })
}

export default handler
