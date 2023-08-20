import { collection, ObjectId } from '@heja/shared/mongodb'
import _ from 'lodash'
import { loader, WPAPIResponse } from './jsonloader'
import { Venue } from '../features/artists/types'

async function parseResult(result: WPAPIResponse[]) {
  const storedIds: ObjectId[] = []

  await Promise.all(
    result.map(async (row: any) => {
      const {
        meta_box: { name_of_venue: name, adress: address, slug, map },
      } = row

      const venue: Partial<Venue> = {
        name: name,
        slug: slug,
        address: address,
        coordinates: {
          latitude: map.latitude,
          longitude: map.longitude,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const existing = await collection<Venue>('venues').findOne({
        name: venue.name,
      })
      if (existing) {
        storedIds.push(existing._id)
        return collection<Partial<Venue>>('venues').updateOne(
          { _id: existing._id },
          {
            $set: _.omit(venue, ['_id', 'externalid', 'createdAt']),
          },
        )
      }
      const result = await collection<Partial<Venue>>('venues').insertOne(venue)
      storedIds.push(result.insertedId)
      return result
    }),
  )

  return storedIds
}

//const url =
//  'https://liveatheart.se/wp-json/wp/v2/project?per_page=20&page={{page}}&_fields=id,date,status,title,content,project_category,acf,featured_media,_links&project_category=212&_embed=wp:featuredmedia,wp:term'

const url =
  'https://liveatheart.se/wp-json/wp/v2/venue?per_page=30&page={{page}}'

async function loadVenues() {
  const storedIds = await loader(url, parseResult)

  if (storedIds && storedIds.length > 0) {
    await collection<Venue>('venues').updateMany(
      { _id: { $nin: storedIds }, deletedAt: { $exists: false } },
      { $set: { deletedAt: new Date() } },
    )
  }
}

export { loadVenues }
