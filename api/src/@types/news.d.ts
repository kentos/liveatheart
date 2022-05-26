import { ObjectId } from '@heja/shared/mongodb'

declare global {
  interface News {
    _id: ObjectId
    id: string
    articleid: string
    title: string
    link: string
    image: string
    published: Date
    createdAt: Date
  }
}
