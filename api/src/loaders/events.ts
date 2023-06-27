import { collection, ObjectId } from '@heja/shared/mongodb'
import { parse, getHours, addDays } from 'date-fns'
import { decode } from 'html-entities'
import _ from 'lodash'
import { loader, WPAPIResponse } from './jsonloader'
import { Artist, LAHEvent } from '../features/artists/types'
import { Film, Seminar, Speaker } from '../features/types'

function fixDate(date: Date) {
  return getHours(date) >= 22 ? addDays(date, 2) : date
}

async function parseResult(result: WPAPIResponse[]) {
  const storedIds: ObjectId[] = []

  await Promise.all(
    result.map(async (row) => {
      const event: Partial<LAHEvent> = {
        title: decode(row.title.rendered),
        externalid: String(row.id),
        date: row.acf.date,
        time: row.acf.starttime,
        venue: {
          externalid: String(row.acf?.event_venue?.ID),
          name: row.acf?.event_venue?.post_title ?? '',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      event.eventAt = parse(
        `${event.date} ${event.time?.substring(0, 5)} +02:00`,
        'dd/MM/yyyy HH:mm XXX',
        new Date(),
      )
      event.eventAt = fixDate(event.eventAt)

      const externalid = String(row.acf?.event_artists?.[0]?.ID)
      const matchingTitle = String(row.acf?.event_artists?.[0]?.post_title)

      const [artist, speaker, seminar, film] = await Promise.all([
        collection<Artist>('artists').findOne({
          $or: [{ externalid: externalid }],
        }),
        collection<Speaker>('speakers').findOne({
          $or: [{ externalid: externalid }],
        }),
        collection<Seminar>('seminars').findOne({
          $or: [{ externalid: externalid }, { name: matchingTitle }],
        }),
        collection<Film>('films').findOne({
          $or: [{ externalid: externalid }, { name: matchingTitle }],
        }),
      ])
      if (!artist && !speaker && !seminar && !film) {
        //console.log('event had no match:', event)
        console.log(event.title)
        return
      }

      if (artist) {
        event.artistid = artist._id
      } else if (speaker) {
        event.speakerid = speaker._id
      } else if (seminar) {
        event.seminarid = seminar._id
      } else if (film) {
        event.filmid = film._id
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
      const result = await collection<Partial<LAHEvent>>('events').insertOne(
        event,
      )
      storedIds.push(result.insertedId)
      return result
    }),
  )

  return storedIds
}

const url =
  'https://liveatheart.se/wp-json/wp/v2/event?per_page=20&page={{page}}&_fields=id,status,title,acf'

async function loadEvents() {
  const storedIds = await loader(url, parseResult)

  if (storedIds && storedIds.length > 0) {
    await collection<LAHEvent>('events').updateMany(
      { _id: { $nin: storedIds }, deletedAt: { $exists: false } },
      { $set: { deletedAt: new Date() } },
    )
  }
}

export { loadEvents }
