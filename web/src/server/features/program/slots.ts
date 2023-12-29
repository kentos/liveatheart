import { type Db, ObjectId } from "@heja/shared/mongodb";
import collections from "~/server/collections";

export async function addSlot(db: Db, date: Date, venueId?: ObjectId) {
  const result = await collections.slots(db).insertOne({
    _id: new ObjectId(),
    venueId,
    date,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId;
}

export async function removeSlot(db: Db, id: ObjectId) {
  await collections.slots(db).deleteOne({ _id: id });
  return true;
}

export async function getSlotsByVenue(db: Db, venueId: ObjectId) {
  const result = await collections.slots(db).find({ venueId }).toArray();
  return result;
}
