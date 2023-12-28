import { commonRouter } from "~/server/api/routers/common";
import { createTRPCRouter } from "~/server/api/trpc";
import auth from "./routers/auth";
import artists from "./routers/artists";
import deals from "./routers/deals";
import news from "./routers/news";
import program from "./routers/program";
import user from "./routers/user";
import admin from "./routers/admin";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  common: commonRouter,
  auth,
  artists,
  deals,
  news,
  program,
  user,
  admin,
});

// export type definition of API
export type AppRouter = typeof appRouter;
