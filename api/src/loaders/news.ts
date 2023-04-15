import * as datefns from 'date-fns'
import { collection } from '@heja/shared/mongodb'
import { decode } from 'html-entities'
import { loader, WPAPIResponse } from './jsonloader'
import { getOriginalImage } from '../features/images/getOriginalImage'
import { omit } from 'radash'

async function parseResult(result: WPAPIResponse[]) {
  await Promise.all(
    result.map(async (row: any) => {
      const existing = await collection<News>('news').findOne({
        articleid: String(row.id),
      })
      const data = {
        articleid: String(row.id),
        title: decode(row.title.rendered),
        link: row.link,
        image: row._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        published: datefns.parseISO(row.date_gmt),
        content: row.meta_box?.news_content,
        createdAt: new Date(),
      }
      if (data.image) {
        getOriginalImage(data.image)
      }
      if (existing) {
        await collection<News>('news').updateOne(
          { _id: existing._id },
          { $set: omit(data, ['title', 'createdAt']) },
        )
      } else {
        await collection<Partial<News>>('news').insertOne(data)
      }
    }),
  )
}

const url =
  'https://liveatheart.se/wp-json/wp/v2/news?_embed=wp:featuredmedia&per_page=5&page={{page}}'

export async function loadNews() {
  await loader(url, parseResult)
}
