import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { setupMongoHook } from '@heja/shared/mongodb'
import getenv from 'getenv'

const mongoDBPlugin: FastifyPluginAsync = async function mongoDBPlugin(
  fastify,
) {
  await fastify.register(setupMongoHook, {
    appName: 'lah-api',
    minPoolSize: getenv.int('MONGODB_MINPOOL', 5),
    maxPoolSize: getenv.int('MONGODB_MAXPOOL', 15),
  })
}

export default fp(mongoDBPlugin, {
  fastify: '3.x',
  name: 'mongodb-connection-hook',
})
