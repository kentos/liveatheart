import { ObjectId } from '@heja/shared/mongodb'

declare global {
  interface Deal {
    _id: ObjectId
    externalid: string
    link: string
    title: string
    description: string
    image: string
  }
}
