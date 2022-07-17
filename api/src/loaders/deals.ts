import { collection } from '@heja/shared/mongodb'
import axios from 'axios'
import * as cheerio from 'cheerio'
import _ from 'lodash'

const dealsUrl = 'https://liveatheart.se/deals-2022/'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function loadDeals() {
  const result = await axios.get(dealsUrl)
  const html = cheerio.load(result.data)
  const all = html('div.et_pb_portfolio_item')

  await Promise.all(
    all.map(async (ix, el) => {
      const h2 = html(el).find('h2 a')
      const deal: Partial<Deal> = {
        title: h2.text(),
        link: h2.attr('href'),
      }

      if (!deal.link) {
        throw new Error('Deal no link found')
      }

      await delay(2000 * ix)

      const page = await axios.get(encodeURI(deal.link))
      const data = cheerio.load(page.data)

      deal.image = data('span.et_pb_image_wrap img').attr('src')
      deal.description = data(
        'div.et_pb_module.et_pb_text.et_pb_text_1 > div.et_pb_text_inner',
      )
        .text()
        .trimStart()

      const article = data('div#main-content article')
      if (article) {
        const id = article.attr('id')
        if (id) {
          deal.externalid = id.replace('post-', '')
        }
      }
      try {
        await collection<Partial<Deal>>('deals').insertOne(deal)
      } catch (e: any) {
        if (deal.externalid) {
          await collection<Partial<Deal>>('deals').updateOne(
            { externalid: deal.externalid },
            { $set: _.omit<Partial<Deal>>(deal, ['_id', 'externalid']) },
          )
        }
      }
    }),
  )
}
