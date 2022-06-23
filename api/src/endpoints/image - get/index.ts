import * as stream from 'stream'
import fs from 'fs'
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from '@heja/shared/fastify'
import sharp from 'sharp'
import { getOriginalImage } from '../../features/images/getOriginalImage'

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/image',
    schema: {
      querystring: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string' },
          type: { type: 'string', enum: ['gray', 'thumb'] },
        },
      },
      response: {
        200: {
          type: 'string',
        },
      },
    },
    handler: async (
      req: FastifyRequest<{
        Querystring: { url: string; type: 'gray' | 'thumb' }
      }>,
      reply: FastifyReply,
    ) => {
      const result = await getOriginalImage(req.query.url)

      let buffer: Buffer
      switch (req.query.type) {
        case 'thumb': {
          const thumb = result + '_thumb'
          if (!fs.existsSync(thumb)) {
            await sharp(result).resize({ height: 160 }).toFile(thumb)
          }
          buffer = fs.readFileSync(thumb)
          break
        }
        default: {
          const grayscaled = result + '_gray'
          if (!fs.existsSync(grayscaled)) {
            await sharp(result)
              .resize({ height: 650 })
              .gamma(1.0)
              .grayscale()
              .toFile(grayscaled)
          }
          buffer = fs.readFileSync(grayscaled)
        }
      }

      const imgStream = new stream.Readable({
        read() {
          this.push(buffer)
          this.push(null)
        },
      })

      return reply.send(imgStream)
    },
  })
}

export default handler
