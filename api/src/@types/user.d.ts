interface Favorite {
  _id: string
}

interface User {
  _id: string
  firstName?: string | null
  lastName?: string[null]
  createdAt?: Date
  favorites?: Favorite[]
}
