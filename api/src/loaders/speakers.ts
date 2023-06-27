import { collection, ObjectId } from '@heja/shared/mongodb'
import { decode } from 'html-entities'
import _ from 'lodash'
import { loader, WPAPIResponse } from './jsonloader'
import { Speaker } from '../features/types'

const url =
  'https://liveatheart.se/wp-json/wp/v2/project?per_page=20&page={{page}}&_fields=id,date,status,title,content,project_category,acf,featured_media,link,_links&project_category=218&_embed=wp:featuredmedia,wp:term'

async function parseData(result: WPAPIResponse[]) {
  const storedIds: ObjectId[] = []

  await Promise.all(
    result.map(async (row: any) => {
      const data: Partial<Speaker> = {
        externalid: String(row.id),
        link: row.link,
        name: decode(row.title.rendered),
        image:
          row._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.[
            'et-pb-gallery-module-image-portrait'
          ]?.source_url,
        categories: row._embedded?.['wp:term']?.[0]?.map((term: any) => ({
          name: term.name,
          slug: term.slug,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const existing = await collection<Speaker>('speakers').findOne({
        externalid: data.externalid,
      })
      if (existing) {
        storedIds.push(existing._id)
        return collection<Speaker>('speakers').updateOne(
          { _id: existing._id },
          {
            $set: _.omit(data, ['externalid', 'createdAt']),
          },
        )
      }
      const result = await collection<Partial<Speaker>>('speakers').insertOne(
        data,
      )
      storedIds.push(result.insertedId)
      return result
    }),
  )
}

async function loadSpeakers() {
  const storedIds = await loader(url, parseData)

  if (storedIds && storedIds.length > 0) {
    await collection<Speaker>('speakers').updateMany(
      { _id: { $nin: storedIds }, deletedAt: { $exists: false } },
      { $set: { deletedAt: new Date() } },
    )
  }
}

export { loadSpeakers }
