import axios from "axios";
import { type NextApiResponse, type NextApiRequest } from "next";

const img = axios.create({
  baseURL: "https://ik.imagekit.io/ieuv5ilul/",
  responseType: "stream",
});

export default async function image(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.id) {
    return res.status(400).json({ error: "Missing id" });
  }
  const imgReq = await img.get(String(req.query.id) + "?tr=n-ik_ml_thumbnail");
  res.status(200).setHeader("content-type", "image/jpeg").send(imgReq.data);
}
