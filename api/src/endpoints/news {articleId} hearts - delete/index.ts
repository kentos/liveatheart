import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { removeHeartArticle } from '../../features/news'
import { toObjectId } from '@heja/shared/mongodb'
import authenticatedEndpoint from '../../lib/authenticateEndpoint'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'DELETE',
    url: '/news/:articleId/hearts',
    preHandler: [authenticatedEndpoint],
    handler: async (req: FastifyRequest<{ Params: { articleId: string } }>) => {
      await removeHeartArticle(
        toObjectId(req.params.articleId),
        req.currentUser._id,
      )
      return 'ok'
    },
  })
}

export default handler
