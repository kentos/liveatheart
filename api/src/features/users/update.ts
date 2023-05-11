import { collection } from '@heja/shared/mongodb'

type Updates = Partial<
  Pick<User, 'firstName' | 'lastName' | 'email' | 'refreshTokenUuid'>
>

async function updateUser(
  userId: User['_id'],
  updates: Updates,
): Promise<User> {
  const result = await collection<User>('users').findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        ...(updates.firstName && { firstName: updates.firstName }),
        ...(updates.lastName && { lastName: updates.lastName }),
        ...(updates.email && { email: updates.email }),
        ...(updates.refreshTokenUuid && {
          refreshTokenUuid: updates.refreshTokenUuid,
        }),
        updatedAt: new Date(),
      },
    },
  )
  if (!result.ok || !result.value) {
    throw new Error('Could not update user')
  }
  return result.value
}

export { updateUser }
