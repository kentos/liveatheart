import { type Db, type ObjectId } from "@heja/shared/mongodb";
import collections from "~/server/collections";

export async function setHeart(db: Db, artistId: ObjectId, userId: string) {
  const result = await collections
    .users(db)
    .updateOne(
      { _id: userId, "favorites._id": { $ne: artistId } },
      { $push: { favorites: { _id: artistId, createdAt: new Date() } } },
    );
  return result.modifiedCount === 1;
}

export async function removeHeart(db: Db, artistId: ObjectId, userId: string) {
  const result = await collections
    .users(db)
    .updateOne({ _id: userId }, { $pull: { favorites: { _id: artistId } } });
  return result.modifiedCount === 1;
}
