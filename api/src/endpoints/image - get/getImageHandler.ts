import fs from 'fs'
import * as stream from 'stream'
import { FastifyReply, FastifyRequest } from '@heja/shared/fastify'
import { getOriginalImage } from '../../features/images/getOriginalImage'
import { collection } from '@heja/shared/mongodb'
import { News } from '../../features/types'
import { applySmartCrop } from '../../features/images/smartCrop'
import sharp from 'sharp'

export default async function getImageHandler(
  req: FastifyRequest<{
    Querystring: { url: string; type: 'gray' | 'thumb' }
  }>,
  reply: FastifyReply,
) {
  const result = await getOriginalImage(req.query.url)

  const urls = await collection<News>('news')
    .aggregate<Pick<News, 'image'>>([{ $project: { image: 1 } }])
    .toArray()
  const newsUrls = urls.map((u) => u.image)

  let buffer: Buffer
  switch (req.query.type) {
    case 'thumb': {
      const thumb = result + '_thumb'
      if (!fs.existsSync(thumb)) {
        if (newsUrls.includes(req.query.url)) {
          await applySmartCrop(result, thumb, 640)
        } else {
          await applySmartCrop(result, thumb, 160)
        }
      }
      buffer = fs.readFileSync(thumb)
      break
    }
    default: {
      const grayscaled = result + '_gray'
      if (!fs.existsSync(grayscaled)) {
        await sharp(result)
          .resize({ height: 640 })
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
}
