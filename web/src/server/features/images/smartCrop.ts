import sharp from "sharp";
import smartCrop from "smartcrop-sharp";

export async function applySmartCrop(
  src: string,
  dest: string,
  width: number,
  height?: number,
) {
  // eslint-disable-next-line
  const result = await smartCrop.crop(src, {
    width,
    height: height ?? width,
    debug: true,
  });
  // eslint-disable-next-line
  const { topCrop: crop } = result;
  // eslint-disable-next-line
  return (
    sharp(src) // eslint-disable-line
      // eslint-disable-next-line
      .extract({
        width: crop.width, // eslint-disable-line
        height: crop.height, // eslint-disable-line
        top: crop.y, // eslint-disable-line
        left: crop.x, // eslint-disable-line
      })
      .resize(width, height) // eslint-disable-line
      .toFile(dest) // eslint-disable-line
  );
}
