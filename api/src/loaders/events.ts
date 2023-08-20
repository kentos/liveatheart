import { collection, ObjectId } from '@heja/shared/mongodb'
import { parse, getHours, addDays, getDate, getMinutes, format } from 'date-fns'
import { decode } from 'html-entities'
import _ from 'lodash'
import { loader, WPAPIResponse } from './jsonloader'
import { Artist, LAHEvent, Venue } from '../features/artists/types'
import { Film, Seminar, Speaker } from '../features/types'
import axios from 'axios'

const replaceName: Record<string, string> = {
  'Örebro Konserthus - Foajén': 'Konserthuset, Foajén',
  'Clarion Hotel': 'Clarion Hotel (Kungsgatan)',
}

type RawEvent = {
  name: string
  start: number
  end: number
  featured: 'yes' | 'no'
  all_day_event: 'yes' | 'no'
  image_url: string
  location_name: string
  location_address: string
  location_lat: number
  location_lon: number
  customfield_1?: {
    value?: string
  }
  event_type?: { [k: string]: string }
  event_type_2?: { [k: string]: string }
}

function fixDate(date: Date) {
  return getHours(date) >= 22 ? addDays(date, 2) : date
}

function findArtist(artists: Artist[], name: string) {
  return artists.find((a) => a.name.toLowerCase() === name.toLowerCase())
}

function stripName(name: string) {
  let n = name
  if (replaceName[name]) {
    n = replaceName[name]
  }
  return n
    .replace('&amp;', '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toLowerCase()
}

function findVenue(venues: Venue[], name: string) {
  return venues.find((a) => stripName(a.name) === stripName(name))
}

async function parseResult(result: { [k: string]: RawEvent }) {
  const storedIds: ObjectId[] = []

  const [artists, venues] = await Promise.all([
    collection<Artist>('artists').find({}).toArray(),
    collection<Venue>('venues').find({}).toArray(),
  ])

  await Promise.all(
    Object.keys(result).map(async (e) => {
      const row = result[e]

      const startDate = new Date(row.start * 1000)

      if (row.event_type_2?.['23'] !== 'Showcase') {
        console.log(
          e,
          'Event_type_2 is not showcase:',
          row.event_type_2?.['23'],
        )
        return
      }

      if (!row.customfield_1?.value) {
        console.log('No artist in customfield_1', row.name)
        return
      }

      const artist = findArtist(artists, row.customfield_1.value)
      if (!artist) {
        console.log('Could not find', row.customfield_1.value)
        return
      }

      const venue = findVenue(venues, row.location_name)

      const event: Omit<LAHEvent, '_id'> = {
        title: row.name,
        externalid: e,
        artistid: artist?._id,
        date: format(startDate, 'yyyy-MM-dd'),
        time: `${getHours(startDate).toString().padStart(2, '0')}:${getMinutes(
          startDate,
        )
          .toString()
          .padStart(2, '0')}`,
        venue: {
          _id: venue?._id,
          name: venue?.name ?? row.location_name,
        },
        eventAt: startDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const existing = await collection<LAHEvent>('events').findOne({
        externalid: event.externalid,
      })
      if (existing) {
        storedIds.push(existing._id)
        return collection<Partial<LAHEvent>>('events').updateOne(
          { _id: existing._id },
          {
            $set: _.omit(event, ['_id', 'externalid', 'createdAt']),
          },
        )
      }
      const { insertedId } = await collection<Partial<LAHEvent>>(
        'events',
      ).insertOne(event)
      storedIds.push(insertedId)
      return result
    }),
  )

  if (storedIds && storedIds.length > 0) {
    await collection<LAHEvent>('events').updateMany(
      { _id: { $nin: storedIds }, deletedAt: { $exists: false } },
      { $set: { deletedAt: new Date() } },
    )
  }

  return storedIds
}

// const url =
//   'https://liveatheart.se/wp-json/wp/v2/event?per_page=20&page={{page}}&_fields=id,status,title,acf'
const url = 'https://liveatheart.se/wp-json/eventon/events'

async function loadEvents() {
  const response = await axios.get<{ events: { [k: string]: RawEvent } }>(url)

  parseResult(response.data.events)
  return

  // const storedIds = await loader(url, parseResult)

  // if (storedIds && storedIds.length > 0) {
  //   await collection<LAHEvent>('events').updateMany(
  //     { _id: { $nin: storedIds }, deletedAt: { $exists: false } },
  //     { $set: { deletedAt: new Date() } },
  //   )
  // }
}

export { loadEvents }
