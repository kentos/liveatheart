import { type Db, type WithoutId } from "@heja/shared/mongodb";
import { type UserSession } from "./types";
import collections from "~/server/collections";

type Ping = {
  user: string;
  os: string;
  osVersion: string;
  timestamp: Date;
};

export async function ping(db: Db, data: Ping) {
  await collections.usersessions<WithoutId<UserSession>>(db).insertOne({
    user: data.user,
    os: data.os,
    osVersion: data.osVersion,
    timestamp: data.timestamp,
    createdAt: new Date(),
  });
}
