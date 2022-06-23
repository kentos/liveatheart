import { ObjectId } from '@heja/shared/mongodb'

declare global {
  interface Category {
    name: string
    hidden: boolean
  }

  interface Artist {
    _id: ObjectId
    externalid: string
    name: string
    categories?: Category[]
    link: string
    image?: string
    description?: string
    spotify?: string
    youtube?: string
  }
}
