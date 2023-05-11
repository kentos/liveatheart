type RefreshToken = {
  _id: string
  uuid: string
}

type AuthToken = { _id: RefreshToken['_id']; isAdmin?: boolean }
