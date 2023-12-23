import { type Db, type ObjectId } from "@heja/shared/mongodb";
import { sift } from "radash";
import collections from "~/server/collections";

export async function getEvents(
  db: Db,
  from: Date,
  to: Date,
  venueId?: ObjectId,
) {
  const artists = await collections
    .artists(db)
    .find({ deletedAt: { $exists: false } })
    .toArray();

  const events = await collections
    .events(db)
    .find({
      artistid: { $exists: true },
      ...(venueId && { "venue._id": venueId }),
      eventAt: { $gt: from, $lt: to },
      deletedAt: { $exists: false },
    })
    .toArray();

  return sift(
    events.map((e) => {
      const a = artists.find((a) => a._id.equals(e.artistid));
      if (!a) {
        return undefined;
      }
      return {
        ...e,
        artist: {
          _id: a._id,
          name: a.name,
          image: a.image,
          categories: a.categories?.map((c) => c.name).join(", ") ?? "",
        },
      };
    }),
  );
}
