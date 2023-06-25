import { collection } from '@heja/shared/mongodb'
import { User } from './types'

export async function setPushToken(userId: string, pushToken: string) {
  await collection<User>('users').updateOne(
    { _id: userId },
    { $set: { 'push.token': pushToken, 'push.updatedAt': new Date() } },
  )
}
