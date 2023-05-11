interface Favorite {
  _id: string
  createdAt: Date
}

interface User {
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
