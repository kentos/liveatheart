import { parse } from 'node-html-parser'
import axios from 'axios'
import { collection } from '@heja/shared/mongodb'

const mainUrl = 'https://liveatheart.se/artists-2022/'

async function loadArtists() {
  const result = await axios.get(mainUrl)
  const html = parse(result.data)

  const items = await Promise.all(
    html.querySelectorAll('div.et_pb_portfolio_item').map(async (i) => {
      const h2 = i.querySelector('h2 a')
      const artist: Partial<Artist> = {
        link: h2?.getAttribute('href'),
        name: h2?.innerText,
      }

      if (!artist.link) {
        throw new Error('No artist link found' + artist.name)
      }

      const page = await axios.get(artist.link)
      const data = parse(page.data)

      artist.image = data
        .querySelector('span.et_pb_image_wrap img')
        ?.getAttribute('src')

      artist.description = data.querySelector(
        'div.et_pb_text_inner p span',
      )?.innerHTML

      artist.spotify = data
        .querySelector('div.et_pb_code_inner iframe')
        ?.getAttribute('src')

      const article = data.querySelector('article')
      if (article) {
        const classes = article.getAttribute('class')
        if (classes) {
          artist.categories = [
            ...classes.matchAll(/project_category-([a-z\-0-9]*)/gi),
          ].map((c) => ({ name: c[1], hidden: false }))
        }
        const id = article.getAttribute('id')
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
