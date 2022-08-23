import { ObjectId } from '@heja/shared/mongodb'

declare global {
  interface Seminar {
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
}