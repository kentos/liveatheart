import { collection } from "@heja/shared/mongodb";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type User } from "../../features/users/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ping } from "../../features/users/ping";
import { getProfile, updateProfile } from "../../features/users/profile";
import collections from "~/server/collections";

export default createTRPCRouter({
  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    const user = await collection<User>("users").findOne({
      _id: ctx.requester,
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    return user.favorites?.map((f) => f._id.toString()) ?? [];
  }),

  ping: protectedProcedure
    .input(
      z.object({
        os: z.string(),
        osVersion: z.string(),
        timestamp: z.date(),
      }),
    )
    .mutation(async ({ ctx: { db, requester }, input }) => {
      await ping(db, {
        user: requester,
        os: input.os,
        osVersion: input.osVersion,
        timestamp: input.timestamp,
      });
    }),

  getProfile: protectedProcedure.query(async ({ ctx: { db, requester } }) => {
    const profile = await getProfile(db, requester);
    if (!profile) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    return profile;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx: { db, requester }, input }) => {
      return updateProfile(db, requester, input);
    }),

  getFeatures: protectedProcedure.query(async ({ ctx: { db, requester } }) => {
    const user = await collections.users(db).findOne({
      _id: requester,
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    const features = {
      showHeartbeat: false,
      hidden: {
        artists: true,
        schedule: true,
        venues: true,
        map: true,
        deals: true,
      },
    };
    return features;
  }),

  deleteProfile: protectedProcedure.mutation(async ({ ctx }) => {
    await collection<User>("users").updateOne(
      { _id: ctx.requester },
      { $set: { deleted: true } },
    );
  }),
});
