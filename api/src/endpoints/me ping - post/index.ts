import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/me/ping',
    schema: {
      body: {
        type: 'object',
        required: ['timestamp'],
        properties: {
          timestamp: { type: 'string' },
          os: { type: 'string' },
          osVersion: { type: 'string' },
        },
      },
    },
    handler: async (
      req: FastifyRequest<{
        Body: { timestamp: string; os: string; osVersion: string }
      }>,
    ) => {
      if (!req.currentUser._id) {
        return ''
      }
      const ping = {
        user: req.currentUser._id,
        os: req.body.os,
        osVersion: req.body.osVersion,
        timestamp: req.body.timestamp,
        createdAt: new Date(),
      }
      await collection('usersessions').insertOne(ping)
      return ''
    },
  })
}

export default handler
