import { NotAllowed } from '@heja/shared/errors'
import { FastifyRequest } from '@heja/shared/fastify'
import verifyAuthtoken from './verifyAuthtoken'

export default async function onlyAdmins(req: FastifyRequest) {
  if (req.headers.authorization) {
    try {
      const user = verifyAuthtoken(req.headers.authorization.substring(7))
      if (user.isAdmin) {
        return
      }
    } catch (e: any) {
      console.log(e)
    }
  }
  throw new NotAllowed('Restricted endpoint')
}
