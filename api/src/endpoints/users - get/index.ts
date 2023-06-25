import { FastifyInstance } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'
import { ulid } from 'ulid'
import { User } from '../../features/users/types'

async function getUniqueId(): Promise<string> {
  const newId = ulid()
  const result = await collection<User>('users').findOne({ _id: newId })
  if (result) {
    return getUniqueId()
  }
  return newId
}

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/users',
    handler: async () => {
      return {
        _id: await getUniqueId(),
      }
    },
  })
}

export default handler
