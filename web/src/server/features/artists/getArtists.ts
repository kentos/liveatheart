import { type Db, type ObjectId } from "@heja/shared/mongodb";
import { objectify } from "radash";
import collections from "~/server/collections";

export async function getArtistsByIds(db: Db, artistIds: ObjectId[]) {
  const artist = await collections
    .artists(db)
    .find({ _id: { $in: artistIds } })
    .toArray();
  return objectify(artist, (a) => a._id.toHexString());
}
