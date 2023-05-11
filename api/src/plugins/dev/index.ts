import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
// import delay from 'delay'

const plugin: FastifyPluginAsync = async function devPlugin(fastify) {
  // fastify.addHook('onRequest', async () => {
  //   fastify.log.info('SLOWING DOWN!')
  //   await delay(2000)
  // })
}

export default fp(plugin, {
  fastify: '3.x',
  name: 'dev-slowness-hook',
})
