import { ObjectId } from '@heja/shared/mongodb'
import { Category, Slot } from './artists/types'

export interface Film {
  _id: ObjectId
  externalid: string
  name: string
  link: string
  image?: string
  description?: string
  slots: Slot[]
  createdAt: Date
  updatedAt: Date
}

export interface News {
  _id: ObjectId
  id: string
  articleid: string
  title: string
  link: string
  image: string
  published: Date
  hearts: string[]
  createdAt: Date
}

export interface Seminar {
  _id: ObjectId
  externalid: string
  name: string
  link: string
  image?: string
  description?: string
  slots: Slot[]
  createdAt: Date
  updatedAt: Date
}

export interface Speaker {
  _id: ObjectId
  externalid: string
  name: string
  categories?: Category[]
  link: string
  image?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}
