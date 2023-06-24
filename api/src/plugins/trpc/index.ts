import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { createContext } from '../../trpc/context'
import { appRouter } from '../../trpc/appRouter'

const trpcPlugin: FastifyPluginAsync = async function trpcPlugin(fastify) {
  await fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  })
}

export default fp(trpcPlugin, {
  fastify: '3.x',
  name: 'trcp-hook',
})
