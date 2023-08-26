import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { getVenues } from '../../features/venues/getVenues'
import { format, parseISO, subHours } from 'date-fns'
import { toObjectId } from '@heja/shared/mongodb'
import _ from 'lodash'
import { getVenue } from '../../features/venues/getVenue'
import { TRPCError } from '@trpc/server'
import { getDayparties } from '../../features/program/getDayparties'
import { getConference } from '../../features/program/getConference'
import { getEvents } from '../../features/program/getEvents'
import {
  getAllEvents,
  groupedAllEventsByHour,
} from '../../features/program/get'

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

  getVenuesForMap: publicProcedure.query(async () => {
    const data = await getVenues()
    const result = _(data)
      .groupBy((v) => `${v.coordinates.latitude},${v.coordinates.longitude}`)
      .mapValues((v) => v[0])
      .flatMap((v) => {
        const nameHasHyphen = v.name.includes('-')
        const name = nameHasHyphen
          ? v.name.substring(0, v.name.indexOf('-')).trim()
          : v.name
        return {
          ...v,
          name,
          type:
            name === 'Scandic Grand'
              ? 'Festival Office & Conference - tickets, wristband & check in'
              : v.type?.toUpperCase(),
        }
      })
      .value()
    console.log(result)
    return result
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
      const events = await getAllEvents(start, end, venue._id)
      const sorted = _.sortBy(events, (e) => e.eventAt)
      return {
        venue: venue,
        program: sorted.map((e) => ({
          _id: e._id.toString(),
          time: format(e.eventAt!, 'HH:mm'),
          day: format(subHours(e.eventAt, 4), 'EEE'),
          artist: e.artist,
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
        const grouped = await groupedAllEventsByHour(
          ranges[input.day][0],
          ranges[input.day][1],
        )

        const result = _(grouped)
          .keys()
          .sortBy((k) => k)
          .map((key) => ({
            time: key.substring(key.indexOf(' ') + 1),
            slots: grouped[key],
          }))
          .value()
        return { program: result }
      }
      if (input.category === 'Day Party') {
        const events = await getDayparties(
          ranges[input.day][0],
          ranges[input.day][1],
        )
        const grouped = _.groupBy(events, (e) =>
          format(e.eventAt, 'yyyy-MM-dd HH:mm'),
        )
        const result = _(grouped)
          .keys()
          .sortBy((k) => k)
          .map((key) => ({
            time: key.substring(key.indexOf(' ') + 1),
            slots: grouped[key],
          }))
          .value()
        return { program: result }
      }
      if (input.category === 'Conference') {
        const events = await getConference(
          ranges[input.day][0],
          ranges[input.day][1],
        )
        const grouped = _.groupBy(events, (e) =>
          format(e.eventAt, 'yyyy-MM-dd HH:mm'),
        )
        const result = _(grouped)
          .keys()
          .sortBy((k) => k)
          .map((key) => ({
            time: key.substring(key.indexOf(' ') + 1),
            slots: grouped[key],
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

      const events = await getEvents(ranges[input.day][0], ranges[input.day][1])

      const grouped = _.groupBy(events, (e) =>
        format(e.eventAt, 'yyyy-MM-dd HH:mm'),
      )

      const program = _(grouped)
        .keys()
        .sortBy((k) => k)
        .map((key) => {
          return {
            time: key.substring(key.indexOf(' ') + 1),
            slots: grouped[key],
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
