import { ObjectId } from '@heja/shared/mongodb'

export interface News {
  _id: ObjectId
  id: string
  articleid: string
  title: string
  link: string
  image: string
  content: string
  published: Date
  hearts: string[]
  createdAt: Date
}

export type Dayparty = {
  _id: ObjectId
  externalid: string
  name: string
  image?: string
  venue: {
    _id?: ObjectId
    name: string
  }
  eventAt: Date
  createdAt: Date
  updatedAt: Date
}

export type Conference = {
  _id: ObjectId
  externalid: string
  name: string
  image?: string
  venue: {
    _id?: ObjectId
    name: string
  }
  eventAt: Date
  createdAt: Date
  updatedAt: Date
}
