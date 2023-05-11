import { FastifyRequest, FastifyReply } from 'fastify'
import { TokenExpiredError } from 'jsonwebtoken'
import verifyAuthtoken from './verifyAuthtoken'

export default async function authenticatedEndpoint(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  if (req.headers.authorization) {
    try {
      const user = verifyAuthtoken(req.headers.authorization.substring(7))
      req.currentUser = { _id: user._id }
      return
    } catch (e: any) {
      if (e instanceof TokenExpiredError) {
        console.log('token expired')
        return reply.code(401).send({ message: 'Token expired' })
      }
    }
  }
  throw new Error('Protected endpoint')
}
