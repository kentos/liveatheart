import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { getVenues } from '../../features/venues/getVenues'
import { getAllArtists } from '../../features/artists/getAllArtists'
import { random } from 'radash'
import { format, parseISO } from 'date-fns'
import { collection, toObjectId } from '@heja/shared/mongodb'
import { LAHEvent, Venue } from '../../features/artists/types'
import _ from 'lodash'
import { getVenue } from '../../features/venues/getVenue'
import { getArtistsByIds } from '../../features/artists/getArtists'

type Categories = 'Concerts' | 'Day Party' | 'Film' | 'Conference'

const ranges = {
  Wed: [parseISO('2023-08-30T09:00:00'), parseISO('2023-08-31T06:00:00')],
  Thu: [parseISO('2023-08-31T09:00:00'), parseISO('2023-09-01T06:00:00')],
  Fri: [parseISO('2023-09-01T09:00:00'), parseISO('2023-09-02T06:00:00')],
  Sat: [parseISO('2023-09-02T09:00:00'), parseISO('2023-09-03T06:00:00')],
}

export default router({
  getScheduleByVenue: publicProcedure
    .input(
      z.object({
        venueId: z.string(),
        day: z.enum(['Wed', 'Thu', 'Fri', 'Sat']),
      }),
    )
    .query(async ({ input }) => {
      const venue = await getVenue(toObjectId(input.venueId))
      if (!venue) {
        return []
      }
      const [start, end] = ranges[input.day]
      const events = await collection<LAHEvent>('events')
        .find(
          {
            'venue._id': venue._id,
            eventAt: { $gt: start, $lt: end },
            artistid: { $exists: true },
          },
          { sort: { eventAt: 1 } },
        )
        .toArray()
      const artists = await getArtistsByIds(events.map((e) => e.artistid!))
      return events.map((e) => ({
        _id: e._id.toString(),
        artist: artists[e.artistid!.toString()],
        eventAt: e.eventAt,
        venue: venue,
      }))
    }),

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

      const grouped = _.groupBy(events, (e) =>
        format(e.eventAt!, 'yyyy-MM-dd HH:mm'),
      )

      const program = _(grouped)
        .keys()
        .sortBy((k) => k)
        .map((key) => {
          return {
            time: key.substring(key.indexOf(' ') + 1),
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
