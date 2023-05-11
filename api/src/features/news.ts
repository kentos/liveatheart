import { ObjectId, collection } from '@heja/shared/mongodb'

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
  await collection<News>('news').updateOne(
    { _id: articleId },
    { $addToSet: { hearts: userId } },
  )
  const article = await collection<News>('news').findOne(
    { _id: articleId },
    { projection },
  )
  if (!article) {
    throw new Error('Article not found')
  }
  return article
}

export async function removeHeartArticle(articleId: ObjectId, userId: string) {
  return collection<News>('news').updateOne(
    { _id: articleId },
    { $pull: { hearts: userId } },
  )
}
