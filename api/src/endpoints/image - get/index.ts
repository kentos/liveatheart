import * as stream from 'stream'
import fs from 'fs'
import path from 'path'
import util from 'util'
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from '@heja/shared/fastify'
import axios from 'axios'
import md5 from 'md5'
import sharp from 'sharp'

const pipeline = util.promisify(stream.pipeline)

const dir = path.join(__dirname, '../../data/images')
try {
  fs.mkdirSync(dir)
} catch (e: any) {
  console.log(e)
}

async function downloadImage(url: string) {
  const outputFile = path.join(dir, md5(url))
  if (fs.existsSync(outputFile)) {
    return outputFile
  }
  const writer = fs.createWriteStream(outputFile)
  const request = await axios.get(url, {
    responseType: 'stream',
  })
  await pipeline(request.data, writer)
  return outputFile
}

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
      const result = await downloadImage(req.query.url)

      if (req.query.type === 'thumb') {
        const thumb = result + '_thumb'
        if (!fs.existsSync(thumb)) {
          await sharp(result).resize({ height: 160 }).toFile(thumb)
        }
        const buffer = fs.readFileSync(thumb)
        const imgStream = new stream.Readable({
          read() {
            this.push(buffer)
            this.push(null)
          },
        })

        return reply.send(imgStream)
      }

      const grayscaled = result + '_gray'
      if (!fs.existsSync(grayscaled)) {
        await sharp(result)
          .resize({ height: 650 })
          .gamma(1.0)
          .grayscale()
          .toFile(grayscaled)
      }

      const buffer = fs.readFileSync(grayscaled)
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
