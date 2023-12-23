import { type Db } from "@heja/shared/mongodb";
import collections from "~/server/collections";

export async function setPushToken(db: Db, userId: string, pushToken: string) {
  await collections
    .users(db)
    .updateOne(
      { _id: userId },
      { $set: { "push.token": pushToken, "push.updatedAt": new Date() } },
    );
}
