import { collection, ObjectId } from '@heja/shared/mongodb'
import _ from 'lodash'
import { getOriginalImage } from '../features/images/getOriginalImage'
import { stripHtml } from 'string-strip-html'
import { decode } from 'html-entities'
import { loader, WPAPIResponse } from './jsonloader'
import { Seminar } from '../features/types'

async function parseResult(result: WPAPIResponse[]) {
  const storedIds: ObjectId[] = []

  await Promise.all(
    result.map(async (row: any) => {
      const data: Partial<Seminar> = {
        externalid: String(row.id),
        name: decode(row.title.rendered),
        image:
          row._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.[
            'et-pb-gallery-module-image-portrait'
          ]?.source_url,
        description: stripHtml(row.acf.bio).result,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (data.image) {
        getOriginalImage(data.image)
      }

      const existing = await collection<Seminar>('seminars').findOne({
        externalid: data.externalid,
      })
      if (existing) {
        storedIds.push(existing._id)
        return collection<Partial<Seminar>>('seminars').updateOne(
          { _id: existing._id },
          {
            $set: _.omit(data, ['_id', 'externalid', 'createdAt']),
          },
        )
      }
      const result = await collection<Partial<Seminar>>('seminars').insertOne(
        data,
      )
      storedIds.push(result.insertedId)
      return result
    }),
  )

  return storedIds
}

const url =
  'https://liveatheart.se/wp-json/wp/v2/project?per_page=20&page={{page}}&_fields=id,date,status,title,content,project_category,acf,featured_media,_links&project_category=219&_embed=wp:featuredmedia,wp:term'

async function loadSeminars() {
  const storedIds = await loader(url, parseResult)

  if (storedIds && storedIds.length > 0) {
    await collection<Seminar>('seminars').updateMany(
      { _id: { $nin: storedIds }, deletedAt: { $exists: false } },
      { $set: { deletedAt: new Date() } },
    )
  }
}

export { loadSeminars }
