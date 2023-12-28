import { z } from "zod";
import { createAccount } from "../../features/auth/createAccount";
import { publicProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { createAuthToken, generateAuthToken } from "../../features/auth/tokens";
import getUser from "~/server/features/users/getUser";
import { TRPCError } from "@trpc/server";
import Cookies from "cookies";

export default createTRPCRouter({
  newAccount: publicProcedure.mutation(async ({ ctx: { db } }) => {
    return createAccount(db);
  }),

  renewAuthToken: publicProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      return createAuthToken(db, input.refreshToken);
    }),

  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx: { db, req, res }, input }) => {
      const user = await getUser(db, { email: input.email });
      if (user.password !== input.password) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid credentials",
        });
      }

      if (!user.refreshTokenUuid) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not have a refresh token",
        });
      }

      const { authToken } = await generateAuthToken(db, user.refreshTokenUuid);
      const c = new Cookies(req, res);
      c.set("auth_token", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 120),
      });
      return true;
    }),

  logout: publicProcedure.mutation(async ({ ctx: { req, res } }) => {
    const c = new Cookies(req, res);
    c.set("auth_token", null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() - 1000 * 60 * 120),
    });
    return true;
  }),
});
