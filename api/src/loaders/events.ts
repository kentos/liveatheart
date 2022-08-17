import { collection, ObjectId } from '@heja/shared/mongodb'
import { parse } from 'date-fns'
import _ from 'lodash'
import { loader, WPAPIResponse } from './jsonloader'

async function parseResult(result: WPAPIResponse[]) {
  const storedIds: ObjectId[] = []

  await Promise.all(
    result.map(async (row: any) => {
      const event: Partial<LAHEvent> = {
        title: row.title.rendered,
        externalid: String(row.id),
        date: row.acf.date,
        time: row.acf.starttime,
        venue: {
          externalid: String(row.acf?.event_venue?.ID),
          name: row.acf?.event_venue?.post_title,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      event.eventAt = parse(
        `${event.date} ${event.time?.substring(0, 5)} +02:00`,
        'dd/MM/yyyy HH:mm XXX',
        new Date(),
      )

      const artistid = String(row.acf?.event_artists?.[0]?.ID)
      const [artist, speaker] = await Promise.all([
        collection<Artist>('artists').findOne({
          externalid: artistid,
        }),
        collection<Speaker>('speakers').findOne({
          externalid: artistid,
        }),
      ])
      if (!artist && !speaker) {
        console.log('event had no artist:', event)
        return
      }

      if (artist) {
        event.artistid = artist._id
      }

      if (speaker) {
        event.speakerid = speaker._id
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
