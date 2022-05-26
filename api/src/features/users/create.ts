import { collection } from '@heja/shared/mongodb'

interface CreateUser {
  _id: string
}

async function createUser({ _id }: CreateUser) {
  await collection<User>('users').insertOne({
    _id,
    firstName: null,
    lastName: null,
  })
}

export { createUser }
