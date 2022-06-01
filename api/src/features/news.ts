import { collection } from '@heja/shared/mongodb'

async function getAllNews(): Promise<News[]> {
  const news = await collection<News>('news')
    .find({}, { sort: { published: -1 } })
    .toArray()
  return news
}

export { getAllNews }
