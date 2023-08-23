import { collection, ObjectId } from '@heja/shared/mongodb'
import { getHours, getMinutes, format } from 'date-fns'
import _ from 'lodash'
import { Artist, LAHEvent, Venue } from '../features/artists/types'
import { Dayparty } from '../features/types'
import axios from 'axios'

const replaceName: Record<string, string> = {
  'Örebro Konserthus - Foajén': 'Konserthuset, Foajén',
  'Clarion Hotel': 'Clarion Hotel (Kungsgatan)',
  'Kulturkvarteret - Entrénscenen': 'Kulturkvarteret, Entréscenen',
  'Kulturkvarteret - Entréscenen': 'Kulturkvarteret, Entréscenen',
  'Kvarteret &amp; Co': 'Kvarteret & Co.',
  'Makeriet - Glashuset': 'Makeriet, Glashuset',
  'Örebro Teater - Stora Scenen': 'Örebro Teater',
  'Scandic Grand - Cupolen': 'Scandic Grand, Cupole',
  'Scandic Grand - Cupole': 'Scandic Grand, Cupole',
  'STÅ Pintxos &amp; Vänner': 'STÅ Pintxos & Vänner',
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

function findArtist(artists: Artist[], name: string) {
  return artists.find((a) => a.name.toLowerCase() === name.toLowerCase())
}

function stripName(name: string) {
  let n = name
  if (replaceName[name]) {
    n = replaceName[name]
  }
  return n.toLowerCase()
}

function findVenue(venues: Venue[], name: string) {
  return venues.find((a) => {
    return stripName(a.name) === stripName(name)
  })
}

async function parseResult(result: { [k: string]: RawEvent }) {
  const storedIds: ObjectId[] = []

  const [artists, venues] = await Promise.all([
    collection<Artist>('artists')
      .find({ deletedAt: { $exists: false } })
      .toArray(),
    collection<Venue>('venues')
      .find({ deletedAt: { $exists: false } })
      .toArray(),
  ])

  await Promise.all(
    Object.keys(result).map(async (e) => {
      const row = result[e]

      const startDate = new Date(row.start * 1000)

      if (row.event_type_2?.['25'] === 'DAYPARTY') {
        const dpevent: Dayparty = {
          _id: new ObjectId(),
          externalid: e,
          name: row.customfield_1!.value!,
          venue: {
            name: row.location_name,
          },
          eventAt: startDate,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        const existing = await collection<Dayparty>('dayparties').findOne({
          externalid: e,
        })
        if (existing) {
          await collection<Partial<Dayparty>>('dayparties').updateOne(
            { _id: existing._id },
            {
              $set: _.omit(dpevent, ['_id', 'externalid', 'createdAt']),
            },
          )
        } else {
          await collection<Dayparty>('dayparties').insertOne(dpevent)
        }
        return
      }
      if (row.event_type_2?.['24'] === 'Conference') {
        const venue = row.location_name && findVenue(venues, row.location_name)
        if (!venue) {
          console.log('Could not find venue', row.location_name)
          return
        }
        const conference = {
          _id: new ObjectId(),
          externalid: e,
          name: row.name,
          venue: {
            _id: venue?._id,
            name: venue?.name ?? row.location_name,
          },
          eventAt: startDate,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        const existing = await collection<any>('conferences').findOne({
          externalid: e,
        })
        if (existing) {
          await collection<any>('conferences').updateOne(
            { _id: existing._id },
            {
              $set: _.omit(conference, ['_id', 'externalid', 'createdAt']),
            },
          )
        } else {
          await collection<any>('conferences').insertOne(conference)
        }
        return
      }
      if (row.event_type_2?.['23'] !== 'Showcase') {
        console.log(e, 'Event_type_2 is not showcase:', row.event_type_2)
        return
      }

      const name =
        row.customfield_1?.value ??
        row.name.substring(0, row.name.indexOf('(') - 1)

      if (!name) {
        console.log('No artist in customfield_1', row.name)
        return
      }

      const artist = findArtist(artists, name.trim())
      if (!artist) {
        console.log('Could not find', name, row.name)
        return
      }

      const venue = row.location_name && findVenue(venues, row.location_name)
      if (!venue) {
        console.log('Could not find venue', row.location_name)
        return
      }

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
