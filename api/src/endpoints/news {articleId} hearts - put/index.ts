import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { heartArticle } from '../../features/news'
import { toObjectId } from '@heja/shared/mongodb'
import authenticatedEndpoint from '../../lib/authenticateEndpoint'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'PUT',
    url: '/news/:articleId/hearts',
    preHandler: [authenticatedEndpoint],
    handler: async (req: FastifyRequest<{ Params: { articleId: string } }>) => {
      return heartArticle(toObjectId(req.params.articleId), req.currentUser._id)
    },
  })
}

export default handler
