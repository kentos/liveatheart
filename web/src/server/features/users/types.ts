import { ObjectId } from '@heja/shared/mongodb'

export interface Favorite {
  _id: ObjectId
  createdAt: Date
}

export interface Push {
  settings?: {
    enabled: boolean
    concertReminder: boolean
    news: boolean
  }
  token?: string
  updatedAt?: Date
}

export interface User {
  _id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  favorites?: Favorite[]
  refreshTokenUuid?: string
  isAdmin?: boolean
  push?: Push
  createdAt?: Date
  updatedAt?: Date
  features?: {
    showSchedule?: boolean
  }
}

export interface UserSession {
  _id: ObjectId
  user: User['_id']
  os: string
  osVersion: string
  timestamp: Date
  createdAt: Date
}
