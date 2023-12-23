import { type Db } from "@heja/shared/mongodb";
import { type User } from "./types";
import collections from "~/server/collections";

type Updates = Partial<
  Pick<User, "firstName" | "lastName" | "email" | "refreshTokenUuid">
>;

async function updateUser(
  db: Db,
  userId: User["_id"],
  updates: Updates,
): Promise<User> {
  const result = await collections.users(db).findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        ...(updates.firstName && { firstName: updates.firstName }),
        ...(updates.lastName && { lastName: updates.lastName }),
        ...(updates.email && { email: updates.email }),
        ...(updates.refreshTokenUuid && {
          refreshTokenUuid: updates.refreshTokenUuid,
        }),
        updatedAt: new Date(),
      },
    },
  );
  if (!result.ok || !result.value) {
    throw new Error("Could not update user");
  }
  return result.value;
}

export { updateUser };
