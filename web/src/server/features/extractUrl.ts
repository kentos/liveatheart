import axios from "axios";
import { load } from "cheerio";

const instance = axios.create();
const reg = new RegExp(/@([0-9,.]+)z/);

export default async function extractUrl(url: string) {
  const response = await instance.get<string>(url);
  if (response.status !== 200) {
    throw new Error("Failed to fetch URL");
  }

  const $ = load(response.data);
  const result: Record<string, string>[] = [];
  $("head")
    .children()
    .filter("meta")
    .each((i, el) => {
      result.push(el.attribs);
    });

  const loc = reg.exec(String(url));
  const sitename = result.find((el) => el.property === "og:site_name");

  return {
    location: loc ? loc[1] : "",
    sitename,
  };
}
