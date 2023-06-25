import { collection } from '@heja/shared/mongodb'
import { User } from './types'

export async function getProfile(userId: string) {
  const result = await collection<User>('users').findOne({ _id: userId })
  return result
}

interface UpdateProfile {
  firstName?: string
  lastName?: string
  email?: string
}
export async function updateProfile(userId: string, updates: UpdateProfile) {
  if (!updates.firstName && !updates.lastName && !updates.email) {
    throw new Error('Nothing to update')
  }
  const result = await collection<User>('users').findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        ...(updates.firstName && { firstName: updates.firstName }),
        ...(updates.lastName && { lastName: updates.lastName }),
        ...(updates.email && { email: updates.email }),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' },
  )
  if (result.ok) {
    return result.value
  }
  throw new Error('Could not update profile')
}
