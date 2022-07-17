import * as cheerio from 'cheerio'
import axios from 'axios'
import { collection } from '@heja/shared/mongodb'
import _ from 'lodash'
import { getOriginalImage } from '../features/images/getOriginalImage'
import { nameParser } from '../lib/nameParser'

const mainUrl = 'https://liveatheart.se/artists-2022/'

function cleanCategory(category: string): string {
  return category.replace(/-2$/, '')
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

async function loadArtists() {
  console.log('loading artists')

  const result = await axios.get(mainUrl)
  const html = cheerio.load(result.data)
  const all = html('div.et_pb_portfolio_item')

  await Promise.all(
    all.map(async (ix, el) => {
      const h2 = html(el).find('h2 a')
      if (!h2) {
        return
      }
      const artist: Partial<Artist> = {
        link: h2.attr('href'),
        name: h2.text(),
      }

      if (!artist.link) {
        throw new Error('No artist link found' + artist.name)
      }

      const [name, countryCode] = nameParser(artist.name)

      if (name) {
        artist.name = name
      }

      if (countryCode) {
        artist.countryCode = countryCode
      }

      await delay(2500 * ix)

      const page = await axios.get(encodeURI(artist.link))
      const data = cheerio.load(page.data)

      if (!data) {
        throw new Error('WA WA could not parse' + artist.link)
      }

      artist.image = data('span.et_pb_image_wrap img').attr('src')
      if (artist.image) {
        getOriginalImage(artist.image)
      }
      artist.description = data('div.et_pb_module.et_pb_text.et_pb_text_2')
        .text()
        .trimStart()
      data('div.et_pb_code_inner iframe').map((_ix, el) => {
        const src = data(el).attr('src')
        if (src?.includes('open.spotify')) {
          artist.spotify = src
        } else if (src?.includes('youtube.com')) {
          artist.youtube = src
        }
      })

      const article = data('div#main-content article')
      if (article) {
        const classes = article.attr('class')
        if (classes) {
          artist.categories = [
            ...classes.matchAll(/project_category-([a-z\-0-9]*)/gi),
          ].map((c) => ({ name: cleanCategory(c[1]), hidden: false }))
        }
        const id = article.attr('id')
        if (id) {
          artist.externalid = id.replace('post-', '')
        }
      }
      try {
        await collection<Partial<Artist>>('artists').insertOne(artist)
      } catch (e: any) {
        if (artist.externalid) {
          await collection<Partial<Artist>>('artists').updateOne(
            { externalid: artist.externalid },
            { $set: _.omit<Partial<Artist>>(artist, ['_id', 'externalid']) },
          )
        }
      }
    }),
  )
}

export { loadArtists }
