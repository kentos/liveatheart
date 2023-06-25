import { ObjectId } from '@heja/shared/mongodb'

export interface Favorite {
  _id: ObjectId
  createdAt: Date
}

export interface User {
  _id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  favorites?: Favorite[]
  refreshTokenUuid?: string
  createdAt?: Date
  updatedAt?: Date
  isAdmin?: boolean
}
