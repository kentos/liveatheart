import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const plugin: FastifyPluginAsync = async function authPlugin(fastify) {
  fastify.log.info('Decorating fastify with currentUser')
  fastify.decorateRequest('currentUser', { _id: '' })

  // fastify.addHook(
  //   'onRequest',
  //   async (req: FastifyRequest, reply: FastifyReply) => {
  //     if (req.headers.authorization) {
  //       const { authorization } = req.headers
  //       try {
  //         const user = verifyAuthtoken(authorization.substring(7))
  //         req.currentUser = { _id: user._id }
  //       } catch (e: any) {
  //         console.log(e)
  //         if (e instanceof TokenExpiredError) {
  //           console.log('token expired')
  //           return reply.code(401).send({ message: 'Token expired' })
  //         }
  //       }
  //     }
  //   },
  // )
}

export default fp(plugin, {
  fastify: '3.x',
  name: 'auth-hook',
})
