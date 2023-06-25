import { ObjectId } from '@heja/shared/mongodb'

export interface Deal {
  _id: ObjectId
  externalid: string
  link: string
  title: string
  company: string
  description: string
  image: string
  publishedAt: Date
}
