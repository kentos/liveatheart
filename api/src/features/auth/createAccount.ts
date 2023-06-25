import { collection } from '@heja/shared/mongodb'
import { ulid } from 'ulid'
import { User } from '../users/types'
import { createUser } from '../users/create'
import { createRefreshToken } from './tokens'
import { decode } from 'jsonwebtoken'
import { RefreshToken } from './types'
import { updateUser } from '../users/update'

async function getUniqueId(): Promise<string> {
  const newId = ulid()
  const result = await collection<User>('users').findOne({ _id: newId })
  if (result) {
    return getUniqueId()
  }
  return newId
}

export async function createAccount() {
  const newId = await getUniqueId()
  const newUser = await createUser({ _id: newId })

  const { refreshToken } = createRefreshToken(newUser._id)
  const { uuid } = decode(refreshToken) as RefreshToken
  await updateUser(newUser._id, { refreshTokenUuid: uuid })
  return { refreshToken }
}
