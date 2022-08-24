import * as stream from 'stream'
import fs from 'fs'
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from '@heja/shared/fastify'
import sharp from 'sharp'
import { getOriginalImage } from '../../features/images/getOriginalImage'
import { collection } from '@heja/shared/mongodb'

let newsUrls: string[] = []

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

      if (newsUrls.length === 0) {
        const urls = await collection<News>('news')
          .aggregate<Pick<News, 'image'>>([{ $project: { image: 1 } }])
          .toArray()
        newsUrls = urls.map((u) => u.image)
      }

      let buffer: Buffer
      switch (req.query.type) {
        case 'thumb': {
          const thumb = result + '_thumb'
          if (!fs.existsSync(thumb)) {
            if (newsUrls.includes(req.query.url)) {
              await sharp(result).resize({ width: 640 }).toFile(thumb)
            } else {
              await sharp(result).resize({ height: 160 }).toFile(thumb)
            }
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
