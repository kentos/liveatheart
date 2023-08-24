import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { getVenues } from '../../features/venues/getVenues'
import { getAllArtists } from '../../features/artists/getAllArtists'
import { format, parseISO } from 'date-fns'
import { ObjectId, collection, toObjectId } from '@heja/shared/mongodb'
import { Artist, LAHEvent } from '../../features/artists/types'
import _ from 'lodash'
import { getVenue } from '../../features/venues/getVenue'
import { getArtistsByIds } from '../../features/artists/getArtists'
import { Dayparty } from '../../features/types'
import { TRPCError } from '@trpc/server'

const ranges = {
  Wed: [parseISO('2023-08-30T07:00:00'), parseISO('2023-08-31T05:00:00')],
  Thu: [parseISO('2023-08-31T07:00:00'), parseISO('2023-09-01T05:00:00')],
  Fri: [parseISO('2023-09-01T07:00:00'), parseISO('2023-09-02T05:00:00')],
  Sat: [parseISO('2023-09-02T07:00:00'), parseISO('2023-09-03T05:00:00')],
}

export default router({
  getVenues: publicProcedure.query(async () => {
    const data = await getVenues()
    return _.sortBy(data, (v) => v.name).map((v) => ({
      ...v,
      _id: v._id.toString(),
    }))
  }),

  getScheduleByVenue: publicProcedure
    .input(
      z.object({
        venueId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const venue = await getVenue(toObjectId(input.venueId))
      if (!venue) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid venue',
        })
      }
      const [start, end] = [ranges['Wed'][0], ranges['Sat'][1]]
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
      return {
        venue: venue,
        program: events.map((e) => ({
          _id: e._id.toString(),
          time: format(e.eventAt!, 'HH:mm'),
          day: format(e.eventAt!, 'EEE'),
          artist: artists[e.artistid!.toString()],
          eventAt: e.eventAt,
          venue: venue,
        })),
      }
    }),

  getScheduleByDay: publicProcedure
    .input(
      z.object({
        category: z.enum(['All', 'Concerts', 'Day Party', 'Conference']),
        day: z.enum(['Wed', 'Thu', 'Fri', 'Sat']),
      }),
    )
    .query(async ({ input }) => {
      if (input.category === 'All') {
        const evs = await Promise.all([
          collection<Dayparty>('dayparties')
            .find({
              eventAt: { $gt: ranges[input.day][0], $lt: ranges[input.day][1] },
            })
            .toArray(),

          collection<any>('conferences')
            .find({
              eventAt: { $gt: ranges[input.day][0], $lt: ranges[input.day][1] },
            })
            .toArray(),

          collection<LAHEvent>('events')
            .find({
              eventAt: { $gt: ranges[input.day][0], $lt: ranges[input.day][1] },
            })
            .toArray(),
        ])

        const grouped = _.groupBy(evs.flat(), (e) =>
          format(e.eventAt!, 'yyyy-MM-dd HH:mm'),
        )

        const artists = await collection<Artist>('artists')
          .find({ deletedAt: { $exists: false } })
          .toArray()
        const venues = await getVenues()

        const result = _(grouped)
          .keys()
          .sortBy((k) => k)
          .map((key) => ({
            time: key.substring(key.indexOf(' ') + 1),
            slots: grouped[key].map((e) => {
              const artist = artists.find(
                (a) => e.artistid && a._id.equals(e.artistid),
              )
              const venue = venues.find(
                (v) => e.venue._id && v._id.equals(e.venue._id),
              )
              return {
                _id: e._id.toString(),
                artist:
                  artist && venue
                    ? {
                        _id: artist?._id,
                        name: artist?.name,
                        categories:
                          artist?.categories?.map((c) => c.name).join(',') ??
                          '',
                        image: artist?.image,
                      }
                    : {
                        name: e.name,
                        image:
                          'https://liveatheart.se/wp-content/uploads/2023/04/LAH-logo-WHITE.png',
                        categories: evs[1].map((e) => e._id).includes(e._id)
                          ? ['Conference']
                          : ['DAYPARTY'],
                      },
                eventAt: e.eventAt,
                venue: venue
                  ? { name: venue?.name }
                  : {
                      _id: new ObjectId().toString(),
                      name: e.venue.name,
                    },
              }
            }),
          }))
          .value()
        return { program: result }
      }
      if (input.category === 'Day Party') {
        const events = await collection<Dayparty>('dayparties')
          .find({
            eventAt: { $gt: ranges[input.day][0], $lt: ranges[input.day][1] },
          })
          .toArray()

        const grouped = _.groupBy(events, (e) =>
          format(e.eventAt!, 'yyyy-MM-dd HH:mm'),
        )

        const result = _(grouped)
          .keys()
          .sortBy((k) => k)
          .map((key) => ({
            time: key.substring(key.indexOf(' ') + 1),
            slots: grouped[key].map((e) => ({
              _id: e._id.toString(),
              artist: {
                name: e.name,
                image:
                  'https://liveatheart.se/wp-content/uploads/2023/04/LAH-logo-WHITE.png',
                categories: [],
              },
              eventAt: e.eventAt,
              venue: {
                _id: new ObjectId().toString(),
                name: e.venue.name,
              },
            })),
          }))
          .value()
        return { program: result }
      }
      if (input.category === 'Conference') {
        const events = await collection<any>('conferences')
          .find({
            eventAt: { $gt: ranges[input.day][0], $lt: ranges[input.day][1] },
          })
          .toArray()
        const grouped = _.groupBy(events, (e) =>
          format(e.eventAt!, 'yyyy-MM-dd HH:mm'),
        )
        const result = _(grouped)
          .keys()
          .sortBy((k) => k)
          .map((key) => ({
            time: key.substring(key.indexOf(' ') + 1),
            slots: grouped[key].map((e) => ({
              _id: e._id.toString(),
              artist: {
                name: e.name,
                image:
                  'https://liveatheart.se/wp-content/uploads/2023/04/LAH-logo-WHITE.png',
                categories: [],
              },
              eventAt: e.eventAt,
              venue: {
                _id: new ObjectId().toString(),
                name: e.venue.name,
              },
            })),
          }))
          .value()
        return { program: result }
      }
      if (input.category !== 'Concerts') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid category',
        })
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
})
