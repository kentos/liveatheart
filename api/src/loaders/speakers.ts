import { collection } from '@heja/shared/mongodb'
import { decode } from 'html-entities'
import _ from 'lodash'
import { loader, WPAPIResponse } from './jsonloader'

const url =
  'https://liveatheart.se/wp-json/wp/v2/project?per_page=20&page={{page}}&_fields=id,date,status,title,content,project_category,acf,featured_media,link,_links&project_category=218&_embed=wp:featuredmedia,wp:term'

async function parseData(result: WPAPIResponse[]) {
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
        return collection<Speaker>('speakers').updateOne(
          { _id: existing._id },
          {
            $set: _.omit(data, ['externalid', 'createdAt']),
          },
        )
      }
      return collection<Partial<Speaker>>('speakers').insertOne(data)
    }),
  )
}

async function loadSpeakers() {
  await loader(url, parseData)
}

export { loadSpeakers }
