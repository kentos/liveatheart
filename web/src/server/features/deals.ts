import { type Db } from "@heja/shared/mongodb";
import collections from "../collections";

async function getAllDeals(db: Db) {
  const deals = await collections
    .deals(db)
    .find({ deletedAt: { $exists: false } }, { sort: { publishedAt: 1 } })
    .toArray();
  return deals;
}

export { getAllDeals };
