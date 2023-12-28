import { ObjectId } from "bson";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import collections from "~/server/collections";
import { updateArticle } from "~/server/features/news";
import { TRPCError } from "@trpc/server";
import updateArtist from "~/server/features/artists/updateArtist";
import createArtist from "~/server/features/artists/createArtist";
import deleteArtist from "~/server/features/artists/deleteArtist";
import { type ProgramDate } from "~/server/features/program/types";
import { type WithoutId } from "@heja/shared/mongodb";
import { range } from "radash";
import { addMinutes } from "date-fns";
import { getVenues } from "~/server/features/venues/getVenues";
import { getVenue } from "~/server/features/venues/getVenue";
import updateVenue from "~/server/features/venues/updateVenue";
import Venue from "~/pages/admin/venues/[id]";

const artists = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx: { db } }) => {
    return collections
      .artists(db)
      .find({ deletedAt: { $exists: false } })
      .toArray();
  }),

  getOne: protectedProcedure
    .input(z.object({ id: z.instanceof(ObjectId) }))
    .query(async ({ ctx: { db }, input }) => {
      return collections.artists(db).findOne({ _id: input.id });
    }),

  categories: protectedProcedure.query(async ({ ctx: { db } }) => {
    const result = await collections
      .artists(db)
      .aggregate<{ _id: string }>([
        { $unwind: "$categories" },
        {
          $group: {
            _id: "$categories.name",
          },
        },
      ])
      .toArray();
    return result.map((item) => item._id);
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        countryCode: z.string(),
        description: z.string().optional(),
        externalid: z.string().optional(),
        image: z.string().optional(),
        spotify: z.string().optional(),
        youtube: z.string().optional(),
        categories: z.array(z.object({ name: z.string(), slug: z.string() })),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      return createArtist(db, input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.instanceof(ObjectId),
        fields: z.object({
          name: z.string().optional(),
          countryCode: z.string().optional(),
          description: z.string().optional(),
          externalid: z.string().optional(),
          image: z.string().optional(),
          link: z.string().optional(),
          spotify: z.string().optional(),
          youtube: z.string().optional(),
          published: z.boolean().optional(),
          categories: z
            .array(z.object({ name: z.string(), slug: z.string() }))
            .optional(),
        }),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      return updateArtist(db, input.id, input.fields);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.instanceof(ObjectId) }))
    .mutation(async ({ ctx: { db }, input }) => {
      return deleteArtist(db, input.id);
    }),
});

const news = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx: { db } }) => {
    return collections
      .news(db)
      .find({ deletedAt: { $exists: false } })
      .toArray();
  }),

  getOne: protectedProcedure
    .input(z.object({ id: z.instanceof(ObjectId) }))
    .query(async ({ ctx: { db }, input }) => {
      const item = await collections.news(db).findOne({ _id: input.id });
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News item not found",
        });
      }
      return item;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.instanceof(ObjectId),
        fields: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          image: z.string().optional(),
          link: z.string().optional(),
          published: z.date().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      return updateArticle(db, input.id, input.fields);
    }),
});

const program = createTRPCRouter({
  addDate: protectedProcedure
    .input(z.object({ date: z.date() }))
    .mutation(async ({ ctx: { db }, input }) => {
      const result = await collections
        .programdates<WithoutId<ProgramDate>>(db)
        .insertOne({
          date: input.date,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      return result.insertedId;
    }),
  removeDate: protectedProcedure
    .input(z.object({ id: z.instanceof(ObjectId) }))
    .mutation(async ({ ctx: { db }, input }) => {
      await collections.programdates(db).deleteOne({ _id: input.id });
      return true;
    }),

  getAll: protectedProcedure.query(async ({ ctx: { db } }) => {
    const result = await collections
      .programdates(db)
      .find({}, { sort: { date: 1 } })
      .toArray();
    return result.map((r) => ({
      ...r,
      slots: [...range(10 * 2, 25 * 2)].map((hour) => ({
        date: addMinutes(r.date, hour * 30),
      })),
    }));
  }),
});

const venues = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx: { db } }) => {
    return getVenues(db);
  }),

  getOne: protectedProcedure
    .input(z.object({ id: z.instanceof(ObjectId) }))
    .query(async ({ ctx: { db }, input }) => {
      const venue = await getVenue(db, input.id);
      if (!venue) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Venue not found",
        });
      }
      return venue;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.instanceof(ObjectId),
        fields: z.object({
          name: z.string().optional(),
          address: z.string().optional(),
          color: z.string().optional(),
          slug: z.string().optional(),
          type: z.enum(["showcase", "dayparty", "conference"]).optional(),
          coordinates: z
            .object({
              latitude: z.string(),
              longitude: z.string(),
            })
            .optional(),
          published: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      return updateVenue(db, input.id, input.fields);
    }),
});

export default createTRPCRouter({
  artists,
  news,
  program,
  venues,
});
