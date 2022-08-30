import * as datefns from 'date-fns'
import { collection } from '@heja/shared/mongodb'
import { decode } from 'html-entities'
import { loader, WPAPIResponse } from './jsonloader'
import { getOriginalImage } from '../features/images/getOriginalImage'

async function parseResult(result: WPAPIResponse[]) {
  await Promise.all(
    result.map(async (row: any) => {
      const existing = await collection<News>('news').findOne({
        articleid: String(row.id),
      })
      if (existing) {
        return
      }
      const data = {
        articleid: String(row.id),
        title: decode(row.title.rendered),
        link: row.link,
        image: row._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        published: datefns.parseISO(row.date_gmt),
        createdAt: new Date(),
      }
      if (data.image) {
        getOriginalImage(data.image)
      }
      await collection<Partial<News>>('news').insertOne(data)
    }),
  )
}

const url =
  'https://liveatheart.se/wp-json/wp/v2/posts?per_page=20&page={{page}}&categories=207&_fields=id,date_gmt,link,title,_links&_embed=wp:featuredmedia'

export async function loadNews() {
  await loader(url, parseResult)
}
