import { collection } from '@heja/shared/mongodb'

async function getAllNews(): Promise<News[]> {
  const news = await collection<News>('news').find({}).toArray()
  return news
}

export { getAllNews }
