import { parse } from 'node-html-parser'
import { ulid } from 'ulid'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import * as datefns from 'date-fns'
import { collection } from '@heja/shared/mongodb'

function parseDate(str: string | undefined): Date {
  if (!str) {
    return new Date()
  }
  return datefns.parse(str, 'MMM dd, yyyy', new Date())
}

export async function loadNews() {
  return
  try {
    const result = await axios.get('https://liveatheart.se/')
    const html = parse(result.data)
    const data = html.querySelectorAll('article.category-news22').map((a) => {
      return {
        id: ulid(),
        articleid: a.getAttribute('id'),
        title: a.querySelector('h2')?.innerText,
        link: a.querySelector('a')?.getAttribute('href'),
        image: a.querySelector('img')?.getAttribute('src'),
        published: parseDate(a.querySelector('span.published')?.innerText),
      }
    })
    fs.writeFileSync(
      path.join(__dirname, '..', 'data', 'news.json'),
      JSON.stringify(data, null, 2),
    )

    await Promise.all(
      data.map(async (a) => {
        const existing = await collection<News>('news').findOne({
          articleid: a.articleid,
        })
        if (existing) {
          return
        }
        return collection<Partial<News>>('news').insertOne({
          articleid: a.articleid || ulid().toString(),
          title: a.title,
          link: a.link,
          image: a.image,
          published: a.published,
          createdAt: new Date(),
        })
      }),
    )
  } catch (e) {
    console.log(e)
  }
}
