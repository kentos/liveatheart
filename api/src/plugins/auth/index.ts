import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

const plugin: FastifyPluginAsync = async function authPlugin(fastify) {
  fastify.log.info('Decorating fastify with currentUser')
  fastify.decorateRequest('currentUser', {})

  fastify.addHook('onRequest', async (req: FastifyRequest) => {
    if (req.headers.authorization) {
      const { authorization } = req.headers
      req.currentUser = {
        _id: authorization.substring(5),
      }
    }
  })
}

export default fp(plugin, {
  fastify: '3.x',
  name: 'auth-hook',
})
