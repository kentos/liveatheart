import { type Db, ObjectId } from "@heja/shared/mongodb";
import collections from "~/server/collections";
import { type ProgramDate } from "./types";
import { TRPCError } from "@trpc/server";

export async function addDate(db: Db, date: Date) {
  const result = await collections.programdates(db).insertOne({
    _id: new ObjectId(),
    date,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId;
}

export async function updateDate(
  db: Db,
  id: ObjectId,
  fields: Partial<ProgramDate>,
) {
  delete fields._id;
  delete fields.createdAt;

  if (Object.keys(fields).length === 0) {
    return false;
  }

  fields.updatedAt = new Date();

  await collections.programdates(db).updateOne({ _id: id }, { $set: fields });
  return true;
}

export async function getDate(db: Db, id: ObjectId) {
  const result = await collections.programdates(db).findOne({ _id: id });
  if (!result) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Date not found" });
  }
  return result;
}
