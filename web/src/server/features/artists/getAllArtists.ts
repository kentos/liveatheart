import { type Db } from "@heja/shared/mongodb";
import { type Artist } from "./types";
import collections from "~/server/collections";

let localCache: Artist[] = [];
let lastSet = Date.now();

export async function getAllArtists(db: Db) {
  if (localCache.length > 0 && Date.now() - lastSet < 1000 * 60 * 2) {
    // 2 minutes in-memory cache
    return localCache;
  }
  lastSet = Date.now();
  localCache = await collections
    .artists(db)
    .find({ image: { $ne: undefined }, deletedAt: { $exists: false } })
    .toArray();
  return localCache;
}
