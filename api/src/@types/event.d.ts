import { ObjectId } from '@heja/shared/mongodb'

declare global {
  interface LAHEvent {
    _id: ObjectId
    externalid: string
    artistid?: ObjectId
    speakerid?: ObjectId
    seminarid?: ObjectId
    filmid?: ObjectId
    title: string
    date: string
    time: string
    venue: {
      externalid: string
      name: string
    }
    eventAt?: Date
    createdAt: Date
    updatedAt: Date
  }
}
