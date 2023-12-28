import { sign, verify } from "jsonwebtoken";
import { type RefreshToken } from "./types";
import { ulid } from "ulidx";
import { type Db } from "@heja/shared/mongodb";
import { TRPCError } from "@trpc/server";
import collections from "~/server/collections";

const REFRESH_SECRET = process.env.REFRESH_SECRET;
const AUTH_SECRET = process.env.AUTH_SECRET;

export function createRefreshToken(userId: string) {
  const payload: RefreshToken = { _id: userId, uuid: ulid() };
  const refreshToken = sign(payload, REFRESH_SECRET!, {
    algorithm: "HS512",
    issuer: "lah-api",
    audience: "lah-client",
    expiresIn: "1y",
  });
  return { refreshToken };
}

export async function createAuthToken(db: Db, refreshToken: string) {
  const verifiedPayload = verify(refreshToken, REFRESH_SECRET!, {
    algorithms: ["HS512"],
    issuer: "lah-api",
    audience: "lah-client",
  }) as RefreshToken;
  return generateAuthToken(db, verifiedPayload.uuid);
}

export async function generateAuthToken(db: Db, refreshTokenUuid: string) {
  const existingUser = await collections.users(db).findOne({
    refreshTokenUuid,
  });
  if (!existingUser) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User not found",
    });
  }

  const authToken = sign(
    {
      _id: existingUser._id,
      ...(existingUser.isAdmin && { isAdmin: true }),
    },
    AUTH_SECRET!,
    {
      algorithm: "HS512",
      issuer: "lah-api",
      audience: "lah-client",
      expiresIn: "2h",
    },
  );
  return { authToken };
}
