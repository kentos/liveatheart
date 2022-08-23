import { collection, ObjectId } from '@heja/shared/mongodb'
import { decode } from 'html-entities'
import _ from 'lodash'
import { stripHtml } from 'string-strip-html'
import { loader, WPAPIResponse } from './jsonloader'

// const url =
//   'https://liveatheart.se/wp-json/wp/v2/project?per_page=20&page={{page}}&_fields=id,date,status,title,content,project_category,acf,featured_media,_links&project_category=224&_embed=wp:featuredmedia,wp:term'

const url =
  'https://liveatheart.se/wp-json/wp/v2/erbjudanden?_fields=id,date,status,type,link,title,acf&page={{page}}'

async function parseResult(result: WPAPIResponse[]) {
  const storedIds: ObjectId[] = []

  await Promise.all(
    result.map(async (row) => {
      const data: Partial<Deal> = {
        externalid: String(row.id),
        title: decode(row.title.rendered),
        company: decode(row.acf.foretag),
        image: row.acf?.logotyp?.url,
        description: stripHtml(row.acf.beskrivning_erbjudande).result,
        publishedAt: new Date(row.date),
      }
      const existing = await collection<Deal>('deals').findOne({
        externalid: data.externalid,
      })
      if (existing) {
        storedIds.push(existing._id)
        return collection<Deal>('deals').updateOne(
          { _id: existing._id },
          { $set: _.omit(data, ['externalid']) },
        )
      }
      const result = await collection<Partial<Deal>>('deals').insertOne(data)
      storedIds.push(result.insertedId)
    }),
  )
  return storedIds
}

export async function loadDeals() {
  const storedIds = await loader(url, parseResult)
  if (storedIds && storedIds.length > 0) {
    await collection<Deal>('deals').deleteMany({ _id: { $nin: storedIds } })
  }
}
