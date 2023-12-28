import { type Db } from "@heja/shared/mongodb";
import { TRPCError } from "@trpc/server";
import collections from "~/server/collections";

export default async function getUser(
  db: Db,
  { id, email }: { id?: string; email?: string },
) {
  const user = await collections.users(db).findOne({
    ...(id && { _id: id }),
    ...(email && { email }),
  });
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return user;
}
