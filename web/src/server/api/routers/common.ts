import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import extractUrl from "~/server/features/extractUrl";

export const commonRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return {
      greeting: `${Date.now()}`,
    };
  }),

  coordinatesFromUrl: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = await extractUrl(input.url);

      const [latitude, longitude] = data.location?.split(",") ?? [];
      const name = data.sitename?.content ?? "";

      return {
        longitude,
        latitude,
        name,
      };
    }),
});
