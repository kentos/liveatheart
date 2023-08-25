import { collection, ObjectId } from '@heja/shared/mongodb'
import _ from 'lodash'
import { getOriginalImage } from '../features/images/getOriginalImage'
// import { nameParser } from '../lib/nameParser'
import { stripHtml } from 'string-strip-html'
// import { decode } from 'html-entities'
import { loader, WPAPIResponse } from './jsonloader'
import { Artist } from '../features/artists/types'
import axios from 'axios'
import ccl from 'country-code-lookup'

async function getAttachments(url: string) {
  const result = await axios.get<[{ media_type: string; source_url: string }]>(
    url,
  )
  return result.data
}

function bakeCountry(raw: string) {
  if (['USA', 'United States (US)'].includes(raw)) {
    return 'United States'
  }
  if (raw === 'Germany/Ireland') {
    return 'Germany'
  }
  if (raw === 'UK') {
    return 'United Kingdom'
  }
  return raw
}

async function parseResult(result: WPAPIResponse[]) {
  const storedIds: ObjectId[] = []

  await Promise.all(
    result.map(async (row: any) => {
      const {
        meta_box: {
          country,
          genre,
          short_artist_bio,
          // facebook,
          // instagram,
          // youtube,
          press_photo,
          image_upload,
          ljudlank_1,
          videolank_1,
          vart_val,
        },
        _links,
      } = row

      if (vart_val !== 'Ja') {
        return
      }

      const name = row.meta_box['artist/band_name']

      let image =
        image_upload?.[0]?.full_url || press_photo?.[0]?.full_url || ''

      const attachmentsUrl = _links['wp:attachment']?.[0]?.href
      if (image.length === 0 && attachmentsUrl) {
        const attachments = await getAttachments(attachmentsUrl)
        const imageAttachment = attachments.find(
          (a) => a.media_type === 'image',
        )
        if (imageAttachment) {
          image = imageAttachment.source_url
        }
      }

      const countries = country
        .split('/')
        .map((c: string) => ccl.byCountry(bakeCountry(c))?.internet)
        .join('/')

      const artist: Partial<Artist> = {
        externalid: String(row.id),
        name: name,
        countryCode: countries || country.substring(0, 2).toUpperCase(),
        image,
        description: stripHtml(short_artist_bio).result,
        categories: [
          {
            name: genre,
            slug: genre,
            hidden: false,
          },
          // sub_genre && {
          //   name: sub_genre,
          //   slug: sub_genre,
          //   hidden: true,
          // },
        ],
        spotify: ljudlank_1?.replace('/artist/', '/embed/artist/'),
        youtube: videolank_1
          ?.replace('watch?v=', 'embed/')
          .replace('https://youtu.be/', 'https://www.youtube.com/embed/'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (artist.image && artist.image !== '') {
        getOriginalImage(artist.image)
      } else {
        console.log('Missing image', artist.name)
      }

      if (artist.spotify && artist.spotify.length === 0) {
        delete artist.spotify
      }

      if (artist.youtube && artist.youtube.length === 0) {
        delete artist.youtube
      }

      const existing = await collection<Artist>('artists').findOne({
        externalid: artist.externalid,
      })
      if (existing) {
        storedIds.push(existing._id)
        return collection<Partial<Artist>>('artists').updateOne(
          { _id: existing._id },
          {
            $set: _.omit(artist, ['_id', 'externalid', 'createdAt']),
          },
        )
      }
      const result = await collection<Partial<Artist>>('artists').insertOne(
        artist,
      )
      storedIds.push(result.insertedId)
      return result
    }),
  )

  return storedIds
}

//const url =
//  'https://liveatheart.se/wp-json/wp/v2/project?per_page=20&page={{page}}&_fields=id,date,status,title,content,project_category,acf,featured_media,_links&project_category=212&_embed=wp:featuredmedia,wp:term'

// const url =
//   'https://liveatheart.se/wp-json/wp/v2/artist?_embed=wp:featuredmedia&per_page=30&page={{page}}'

const url =
  'https://liveatheart.se/wp-json/wp/v2/artist_new?_embed=wp:featuredmedia&per_page=60&page={{page}}'

async function loadArtists() {
  const storedIds = await loader(url, parseResult)

  if (storedIds && storedIds.length > 0) {
    await collection<Artist>('artists').updateMany(
      { _id: { $nin: storedIds }, deletedAt: { $exists: false } },
      { $set: { deletedAt: new Date() } },
    )
  }
}

export { loadArtists }
