import { ObjectId } from '@heja/shared/mongodb'

declare global {
  interface Venue {
    _id: ObjectId
    name: string
  }

  interface Slot {
    _id: ObjectId
    venue: Venue
    day: 'wednesday' | 'thursday' | 'friday' | 'saturday'
    date: string
    time: string
    eventAt: Date
  }

  interface Category {
    name: string
    slug: string
    hidden: boolean
  }

  interface Artist {
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
    slots: Slot[]
    createdAt: Date
    updatedAt: Date
  }
}
