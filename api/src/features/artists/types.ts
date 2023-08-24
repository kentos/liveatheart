import { ObjectId } from '@heja/shared/mongodb'

export interface Venue {
  _id: ObjectId
  name: string
  slug: string
  address: string
  createdAt: Date
  updatedAt: Date
}

export interface Slot {
  _id: ObjectId
  venue: Venue
  day: 'wednesday' | 'thursday' | 'friday' | 'saturday'
  date: string
  time: string
  eventAt: Date
}

export interface Category {
  name: string
  slug: string
  hidden: boolean
}

export interface Artist {
  _id: ObjectId
  externalid: string
  name: string
  countryCode?: string
  categories?: Category[]
  link: string
  image?: string
  description?: string
  spotify?: string
  youtube?: string
  // slots: Slot[]
  createdAt: Date
  updatedAt: Date
}

export interface LAHEvent {
  _id: ObjectId
  externalid: string
  artistid: ObjectId
  title: string
  date: string
  time: string
  venue: {
    externalid?: string
    _id?: ObjectId
    name: string
  }
  eventAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface Venue {
  _id: ObjectId
  name: string
  coordinates: {
    latitude: number
    longitude: number
  }
  matches?: string[]
}
