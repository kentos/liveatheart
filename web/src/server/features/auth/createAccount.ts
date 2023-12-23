import { type Db } from "@heja/shared/mongodb";
import { ulid } from "ulidx";
import { createUser } from "../users/create";
import { createRefreshToken } from "./tokens";
import { decode } from "jsonwebtoken";
import { type RefreshToken } from "./types";
import { updateUser } from "../users/update";
import collections from "~/server/collections";

async function getUniqueId(db: Db): Promise<string> {
  const newId = ulid();
  const result = await collections.users(db).findOne({ _id: newId });
  if (result) {
    return getUniqueId(db);
  }
  return newId;
}

export async function createAccount(db: Db) {
  const newId = await getUniqueId(db);
  const newUser = await createUser(db, { _id: newId });

  const { refreshToken } = createRefreshToken(newUser._id);
  const { uuid } = decode(refreshToken) as RefreshToken;
  await updateUser(db, newUser._id, { refreshTokenUuid: uuid });
  return { refreshToken };
}
