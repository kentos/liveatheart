import * as cheerio from 'cheerio'
import axios from 'axios'
import { collection } from '@heja/shared/mongodb'

const mainUrl = 'https://liveatheart.se/artists-2022/'

async function loadArtists() {
  const result = await axios.get(mainUrl)
  const html = cheerio.load(result.data)
  const all = html('div.et_pb_portfolio_item')

  const items = await Promise.all(
    all.map(async (i, el) => {
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

      const page = await axios.get(artist.link)
      const data = cheerio.load(page.data)

      if (!data) {
        throw new Error('WA WA could not parse' + artist.link)
      }

      artist.image = data('span.et_pb_image_wrap img').attr('src')
      artist.description = data('div.et_pb_text_inner p span').text()
      artist.spotify = data('div.et_pb_code_inner iframe').attr('src')

      const article = data('div#main-content article')
      if (article) {
        const classes = article.attr('class')
        if (classes) {
          artist.categories = [
            ...classes.matchAll(/project_category-([a-z\-0-9]*)/gi),
          ].map((c) => ({ name: c[1], hidden: false }))
        }
        const id = article.attr('id')
        if (id) {
          artist.externalid = id.replace('post-', '')
        }
      }
      try {
        await collection<Partial<Artist>>('artists').insertOne(artist)
      } catch (e: any) {
        console.log('silent failes to insert new artist')
      }

      return artist
    }),
  )

  console.dir(items, { depth: 10 })
}

export { loadArtists }
