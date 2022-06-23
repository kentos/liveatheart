import * as stream from 'stream'
import fs from 'fs'
import path from 'path'
import util from 'util'
import axios from 'axios'
import md5 from 'md5'

const pipeline = util.promisify(stream.pipeline)

const dir = path.join(__dirname, '../../data/images')
try {
  fs.mkdirSync(dir)
} catch (e: any) {
  console.log(dir, 'exists')
}

async function getOriginalImage(url: string) {
  const outputFile = path.join(dir, md5(url))
  if (fs.existsSync(outputFile)) {
    return outputFile
  }
  const writer = fs.createWriteStream(outputFile)
  const request = await axios.get(encodeURI(url), {
    responseType: 'stream',
  })
  await pipeline(request.data, writer)
  return outputFile
}

export { getOriginalImage, dir }
