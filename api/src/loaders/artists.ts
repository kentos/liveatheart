import { collection, ObjectId } from '@heja/shared/mongodb'
import _ from 'lodash'
import { getOriginalImage } from '../features/images/getOriginalImage'
// import { nameParser } from '../lib/nameParser'
import { stripHtml } from 'string-strip-html'
// import { decode } from 'html-entities'
import { loader, WPAPIResponse } from './jsonloader'
import { Artist } from '../features/artists/types'

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
          ljudlank_1,
          videolank_1,
          vart_val,
        },
      } = row

      if (vart_val !== 'Ja') {
        return
      }

      const name = row.meta_box['artist/band_name']

      const image =
        press_photo?.[0]?.sizes?.large?.file ||
        press_photo?.[0]?.sizes?.medium_large?.file ||
        press_photo?.[0]?.sizes?.medium?.file ||
        press_photo?.[0]?.url ||
        ''

      const artist: Partial<Artist> = {
        externalid: String(row.id),
        name: name,
        countryCode: country.substring(0, 3),
        image: `https://liveatheart.se/wp-content/uploads/2023/08/${image}`,
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

      if (artist.image) {
        getOriginalImage(artist.image)
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
