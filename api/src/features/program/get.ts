import _ from 'lodash'
import { getConference } from './getConference'
import { getDayparties } from './getDayparties'
import { getEvents } from './getEvents'
import { format } from 'date-fns'
import { ObjectId } from '@heja/shared/mongodb'

export async function getAllEvents(from: Date, to: Date, venueId?: ObjectId) {
  const evs = await Promise.all([
    getEvents(from, to, venueId),
    getDayparties(from, to, venueId),
    getConference(from, to, venueId),
  ])
  return evs.flat()
}

export async function groupedAllEventsByHour(from: Date, to: Date) {
  const evs = await getAllEvents(from, to)
  const grouped = _.groupBy(evs, (e) => format(e.eventAt, 'yyyy-MM-dd HH:mm'))
  return grouped
}
