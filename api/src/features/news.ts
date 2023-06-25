import { ObjectId, collection } from '@heja/shared/mongodb'
import { News } from './types'

const projection = {
  title: 1,
  link: 1,
  image: 1,
  published: 1,
  content: 1,
  hearts: 1,
}

export async function getAllNews(): Promise<News[]> {
  const news = await collection<News>('news')
    .find(
      {},
      {
        sort: { published: -1 },
        projection,
      },
    )
    .toArray()
  return news
}

export async function heartArticle(
  articleId: ObjectId,
  userId: string,
): Promise<News> {
  const result = await collection<News>('news').findOneAndUpdate(
    { _id: articleId },
    { $addToSet: { hearts: userId } },
    { returnDocument: 'after' },
  )
  if (!result.ok) {
    throw new Error('Article not updated')
  }
  if (!result.value) {
    throw new Error('Article not found')
  }
  return result.value
}

export async function removeHeartArticle(articleId: ObjectId, userId: string) {
  return collection<News>('news').findOneAndUpdate(
    { _id: articleId },
    { $pull: { hearts: userId } },
    { returnDocument: 'after' },
  )
}
