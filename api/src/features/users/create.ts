import { collection } from '@heja/shared/mongodb'
import DBError from '../../errors/DBError'

interface CreateUser {
  _id: string
}

async function createUser({ _id }: CreateUser): Promise<User> {
  const result = await collection<User>('users').insertOne({
    _id,
    firstName: null,
    lastName: null,
    createdAt: new Date(),
  })

  const user = await collection<User>('users').findOne({
    _id: result.insertedId,
  })
  if (!user) {
    throw new DBError('Create user not found')
  }
  return user
}

export { createUser }
