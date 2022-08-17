import { ObjectId } from '@heja/shared/mongodb'

declare global {
  interface Venue {
    _id: ObjectId
    name: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
}
