import { type Db, type ObjectId } from "@heja/shared/mongodb";
import collections from "~/server/collections";

export async function getVenue(db: Db, venueId: ObjectId) {
  return collections.venues(db).findOne({ _id: venueId });
}
