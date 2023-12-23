import { z } from "zod";
import {
  getAllNews,
  heartArticle,
  removeHeartArticle,
} from "../../features/news";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";
import { toObjectId } from "@heja/shared/mongodb";
import { TRPCError } from "@trpc/server";

export default createTRPCRouter({
  getNews: publicProcedure.query(async ({ ctx: { db } }) => {
    return (await getAllNews(db)).map((n) => ({
      ...n,
      _id: n._id.toString(),
    }));
  }),

  setHeart: protectedProcedure
    .input(z.object({ articleId: z.string() }))
    .mutation(async ({ ctx: { db, requester }, input }) => {
      if (!requester) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return heartArticle(db, toObjectId(input.articleId), requester);
    }),
  removeHeart: protectedProcedure
    .input(z.object({ articleId: z.string() }))
    .mutation(async ({ ctx: { db, requester }, input }) => {
      if (!requester) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return removeHeartArticle(db, toObjectId(input.articleId), requester);
    }),
});
