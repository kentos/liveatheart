import { collection } from '@heja/shared/mongodb'
import { decode } from 'html-entities'
import _ from 'lodash'
import { stripHtml } from 'string-strip-html'
import { loader, WPAPIResponse } from './jsonloader'

const url =
  'https://liveatheart.se/wp-json/wp/v2/project?per_page=20&page={{page}}&_fields=id,date,status,title,content,project_category,acf,featured_media,_links&project_category=224&_embed=wp:featuredmedia,wp:term'

async function parseResult(result: WPAPIResponse[]) {
  result.map(async (row) => {
    const data: Partial<Deal> = {
      externalid: String(row.id),
      title: decode(row.title.rendered),
      image:
        row._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes?.[
          'et-pb-image--responsive--phone'
        ]?.source_url,
      description: stripHtml(row.acf.bio).result,
    }
    const existing = await collection<Deal>('deals').findOne({
      externalid: data.externalid,
    })
    if (existing) {
      return collection<Deal>('deals').updateOne(
        { _id: existing._id },
        { $set: _.omit(data, ['externalid']) },
      )
    }
    return collection<Partial<Deal>>('deals').insertOne(data)
  })
}

export async function loadDeals() {
  await loader(url, parseResult)
}
