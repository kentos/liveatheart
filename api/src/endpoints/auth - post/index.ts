import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { ObjectId, toObjectId } from '@heja/shared/mongodb'
import { sign } from 'jsonwebtoken'

async function createRefreshToken(userId: ObjectId) {
  const payload = { _id: userId.toString() }
  const token = sign(payload, 'supersecret', {
    algorithm: 'HS512',
    noTimestamp: true,
  })
  return token
}

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/auth',
    handler: async (req: FastifyRequest) => {
      if (req.currentUser._id) {
        return createRefreshToken(toObjectId(req.currentUser._id))
      }
    },
  })
}

export default handler
