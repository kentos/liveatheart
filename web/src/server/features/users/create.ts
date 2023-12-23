import { type Db } from "@heja/shared/mongodb";
import { TRPCError } from "@trpc/server";
import collections from "~/server/collections";
import { type User } from "./types";

interface CreateUser {
  _id: string;
}

async function createUser(db: Db, { _id }: CreateUser): Promise<User> {
  const result = await collections.users(db).insertOne({
    _id,
    firstName: null,
    lastName: null,
    createdAt: new Date(),
  });

  const user = await collections.users(db).findOne({
    _id: result.insertedId,
  });
  if (!user) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Created user not found",
    });
  }
  return user;
}

export { createUser };
