export type RefreshToken = {
  _id: string
  uuid: string
}

export type AuthToken = {
  _id: RefreshToken['_id']
  isAdmin?: boolean
}
