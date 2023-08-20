import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { getVenues } from '../../features/venues/getVenues'
import { getAllArtists } from '../../features/artists/getAllArtists'
import { random } from 'radash'
import { format, parseISO } from 'date-fns'
import { collection } from '@heja/shared/mongodb'
import { LAHEvent } from '../../features/artists/types'
import _ from 'lodash'

type Categories = 'Concerts' | 'Day Party' | 'Film' | 'Conference'

const ranges = {
  Wed: [parseISO('2023-08-30T09:00:00'), parseISO('2023-08-31T06:00:00')],
  Thu: [parseISO('2023-08-31T09:00:00'), parseISO('2023-09-01T06:00:00')],
  Fri: [parseISO('2023-09-01T09:00:00'), parseISO('2023-09-02T06:00:00')],
  Sat: [parseISO('2023-09-02T09:00:00'), parseISO('2023-09-03T06:00:00')],
}

export default router({
  getScheduleByDay: publicProcedure
    .input(
      z.object({
        category: z.enum(['Concerts', 'Day Party', 'Film', 'Conference']),
        day: z.enum(['Wed', 'Thu', 'Fri', 'Sat']),
      }),
    )
    .query(async ({ input }) => {
      if (input.category !== 'Concerts') {
        return []
      }

      const artists = await getAllArtists()
      const venues = await getVenues()

      const events = await collection<LAHEvent>('events')
        .find({
          eventAt: { $gt: ranges[input.day][0], $lt: ranges[input.day][1] },
        })
        .toArray()

      const grouped = _.groupBy(
        events,
        (e) =>
          e.eventAt?.getHours() +
          ':' +
          e.eventAt?.getMinutes().toString().padStart(2, '0'),
      )

      const program = _(grouped)
        .keys()
        .sortBy((k) => k)
        .map((key) => {
          return {
            time: key,
            slots: grouped[key].map((e) => {
              const artist = artists.find(
                (a) => e.artistid && a._id.equals(e.artistid),
              )
              const venue = venues.find(
                (v) => e.venue._id && v._id.equals(e.venue._id),
              )
              return {
                artist: {
                  _id: artist?._id,
                  name: artist?.name,
                  categories:
                    artist?.categories?.map((c) => c.name).join(',') ?? '',
                  image: artist?.image,
                },
                venue: { name: venue?.name },
              }
            }),
          }
        })
        .value()

      return {
        program,
        day: input.day,
        category: input.category,
      }
    }),

  getVenues: publicProcedure.query(async () => {
    return getVenues()
  }),
})
