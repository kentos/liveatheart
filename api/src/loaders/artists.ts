import { collection } from '@heja/shared/mongodb'
import _ from 'lodash'
import { getOriginalImage } from '../features/images/getOriginalImage'
import { nameParser } from '../lib/nameParser'
import { stripHtml } from 'string-strip-html'
import { decode } from 'html-entities'
import { loader, WPAPIResponse } from './jsonloader'

async function parseResult(result: WPAPIResponse[]) {
  await Promise.all(
    result.map(async (row: any) => {
      const [name, countryCode] = nameParser(row.title.rendered)

      const artist: Partial<Artist> = {
        externalid: String(row.id),
        name: decode(name),
        countryCode,
        image:
          row._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.[
            'et-pb-gallery-module-image-portrait'
          ]?.source_url,
        description: stripHtml(row.acf.bio).result,
        categories: row._embedded?.['wp:term']?.[0]?.map((term: any) => ({
          name: term.name,
          slug: term.slug,
        })),
        spotify: row.acf?.spotify?.replace('/artist/', '/embed/artist/'),
        youtube: row.acf?.youtube
          ?.replace('watch?v=', 'embed/')
          .replace('https://youtu.be/', 'https://www.youtube.com/embed/'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (artist.image) {
        getOriginalImage(artist.image)
      }

      const existing = await collection<Artist>('artists').findOne({
        externalid: artist.externalid,
      })
      if (existing) {
        return collection<Partial<Artist>>('artists').updateOne(
          { _id: existing._id },
          {
            $set: _.omit(artist, ['_id', 'externalid', 'createdAt']),
          },
        )
      }
      return collection<Partial<Artist>>('artists').insertOne(artist)
    }),
  )
}

const url =
  'https://liveatheart.se/wp-json/wp/v2/project?per_page=20&page={{page}}&_fields=id,date,status,title,content,project_category,acf,featured_media,_links&project_category=212&_embed=wp:featuredmedia,wp:term'

async function loadArtists() {
  await loader(url, parseResult)
}

export { loadArtists }
