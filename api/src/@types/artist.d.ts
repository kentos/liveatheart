import { ObjectId } from '@heja/shared/mongodb'

declare global {
  interface Venue {
    _id: ObjectId
    name: string
  }

  interface Concert {
    _id: ObjectId
    venue: Venue
    day: 'wednesday' | 'thursday' | 'friday' | 'saturday'
    time: string
    eventAt: Date
  }

  interface Category {
    name: string
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
    concerts: Concert[]
  }
}
