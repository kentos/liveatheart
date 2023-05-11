import sharp from 'sharp'
import smartCrop from 'smartcrop-sharp'

export async function applySmartCrop(
  src: string,
  dest: string,
  width: number,
  height?: number,
) {
  const result = await smartCrop.crop(src, {
    width,
    height: height || width,
    debug: true,
  })
  console.log(result)
  const { topCrop: crop } = result
  return sharp(src)
    .extract({
      width: crop.width,
      height: crop.height,
      top: crop.y,
      left: crop.x,
    })
    .resize(width, height)
    .toFile(dest)
}
