import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
// import delay from 'delay'

const plugin: FastifyPluginAsync = async function devPlugin(fastify) {
  fastify.addHook('onRequest', async (req: FastifyRequest) => {
    // fastify.log.info('SLOWING DOWN!')
    // await delay(2000)
    // fastify.log.info(`Authorization: ${req.headers['authorization']}`)
  })
}

export default fp(plugin, {
  fastify: '3.x',
  name: 'dev-slowness-hook',
})
