import { ObjectId, collection } from '@heja/shared/mongodb'
import { User } from '../users/types'

export async function setHeart(artistId: ObjectId, userId: string) {
  const result = await collection<User>('users').updateOne(
    { _id: userId, 'favorites._id': { $ne: artistId } },
    { $push: { favorites: { _id: artistId, createdAt: new Date() } } },
  )
  return result.modifiedCount === 1
}

export async function removeHeart(artistId: ObjectId, userId: string) {
  const result = await collection<User>('users').updateOne(
    { _id: userId },
    { $pull: { favorites: { _id: artistId } } },
  )
  return result.modifiedCount === 1
}
