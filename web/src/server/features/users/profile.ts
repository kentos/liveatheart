import { type Db } from "@heja/shared/mongodb";
import collections from "~/server/collections";

export async function getProfile(db: Db, userId: string) {
  return collections.users(db).findOne({ _id: userId });
}

interface UpdateProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export async function updateProfile(
  db: Db,
  userId: string,
  updates: UpdateProfile,
) {
  if (!updates.firstName && !updates.lastName && !updates.email) {
    throw new Error("Nothing to update");
  }
  const result = await collections.users(db).findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        ...(updates.firstName && { firstName: updates.firstName }),
        ...(updates.lastName && { lastName: updates.lastName }),
        ...(updates.email && { email: updates.email }),
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
  if (result.ok) {
    return result.value;
  }
  throw new Error("Could not update profile");
}
