import { type Db, type ObjectId } from "@heja/shared/mongodb";
import collections from "~/server/collections";

export async function getDayparties(
  db: Db,
  from: Date,
  to: Date,
  venueId?: ObjectId,
) {
  const events = await collections
    .dayparties(db)
    .find({
      ...(venueId && { "venue._id": venueId }),
      eventAt: { $gt: from, $lt: to },
      deletedAt: { $exists: false },
    })
    .toArray();
  return events.map((e) => ({
    ...e,
    artist: {
      name: e.name,
      image:
        e.image ??
        "https://liveatheart.se/wp-content/uploads/2023/04/LAH-logo-WHITE.png",
      categories: ["Dayparty"],
    },
  }));
}
