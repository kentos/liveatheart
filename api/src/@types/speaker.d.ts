import { ObjectId } from '@heja/shared/mongodb'

declare global {
  interface Speaker {
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
}
