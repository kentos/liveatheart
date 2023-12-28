import { type Db, type ObjectId } from "@heja/shared/mongodb";
import collections from "~/server/collections";

export default async function deleteArtist(db: Db, id: ObjectId) {
  const result = await collections.artists(db).deleteOne({ _id: id });
  if (result.deletedCount !== 1) {
    throw new Error("Artist not found");
  }

  return true;
}

// export async function setPublishedStatus(
//   db: Db,
//   id: ObjectId,
//   status: boolean,
// ) {
//   const result = await collections
//     .artists(db)
//     .findOneAndUpdate(
//       { _id: id, published: !status },
//       { $set: { published: status } },
//       { returnDocument: "after" },
//     );
//   if (!result.ok || !result.value) {
//     throw new Error("Artist not found");
//   }
//   return result.value;
// }
