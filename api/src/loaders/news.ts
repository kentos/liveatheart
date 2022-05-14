import { parse } from 'node-html-parser'
import { ulid } from 'ulid'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

export async function loadNews() {
  try {
    const result = await axios.get('https://liveatheart.se/');
    const html = parse(result.data);
    const data = html.querySelectorAll('article.category-news22').map(a => {
      return {
        id: ulid(),
        title: a.querySelector('h2')?.innerText,
        link: a.querySelector('a')?.getAttribute('href'),
        image: a.querySelector('img')?.getAttribute('src'),
        published: a.querySelector('span.published')?.innerText,
      }
    })
    console.log(data)
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'news.json'), JSON.stringify(data, null, 2))
  } catch (e) {
    console.log(e)
  }
}