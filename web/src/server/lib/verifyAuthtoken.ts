import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { type AuthToken } from "../features/auth/types";

const AUTH_SECRET = process.env.AUTH_SECRET;

export default function verifyAuthtoken(token: string) {
  try {
    return jwt.verify(token, AUTH_SECRET!, {
      algorithms: ["HS512"],
    }) as AuthToken;
  } catch (e: unknown) {
    if (e instanceof jwt.TokenExpiredError) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
  }
}
