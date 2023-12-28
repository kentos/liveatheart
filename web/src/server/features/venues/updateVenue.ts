import { type Db, type ObjectId } from "@heja/shared/mongodb";
import collections from "~/server/collections";
import { type Venue } from "../artists/types";

export default async function updateVenue(
  db: Db,
  id: ObjectId,
  fields: { [key in keyof Partial<Venue>]: Venue[key] },
) {
  delete fields._id;
  delete fields.createdAt;

  if (Object.keys(fields).length === 0) {
    throw new Error("No fields to update");
  }

  fields.updatedAt = new Date();

  const result = await collections
    .venues(db)
    .findOneAndUpdate(
      { _id: id },
      { $set: fields },
      { returnDocument: "after" },
    );
  if (!result.ok) {
    throw new Error("Artist not updated");
  }
  if (!result.value) {
    throw new Error("Artist not found");
  }
  return result.value;
}
