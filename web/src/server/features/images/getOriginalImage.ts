import * as stream from "stream";
import fs from "fs";
import path from "path";
import util from "util";
import axios from "axios";
import md5 from "md5";

const pipeline = util.promisify(stream.pipeline);

const dir = path.join(__dirname, "../../data/images");
try {
  fs.mkdirSync(dir);
} catch (e: unknown) {
  console.log(dir, "exists");
}

type SourceFile = string;

async function getOriginalImage(url: string): Promise<SourceFile> {
  const fileName = md5(url);
  const outputFile = path.join(dir, fileName);
  if (fs.existsSync(outputFile)) {
    return outputFile;
  }
  const writer = fs.createWriteStream(outputFile);
  // eslint-disable-next-line
  const request = await axios.get(encodeURI(url), {
    responseType: "stream",
  });
  // eslint-disable-next-line
  await pipeline(request.data, writer);
  return outputFile;
}

export { getOriginalImage, dir };
