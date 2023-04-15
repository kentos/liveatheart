import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { getAllNews, heartArticle } from '../../features/news'
import { toObjectId } from '@heja/shared/mongodb'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'PUT',
    url: '/news/:articleId/heart',
    handler: async (req: FastifyRequest<{ Params: { articleId: string } }>) => {
      return heartArticle(toObjectId(req.params.articleId))
    },
  })
}

export default handler
