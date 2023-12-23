import { type Db } from "@heja/shared/mongodb";
import collections from "~/server/collections";

export async function getVenues(db: Db) {
  return collections
    .venues(db)
    .find({ deletedAt: { $exists: false } })
    .toArray();
}
