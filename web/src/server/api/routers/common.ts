import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const commonRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return {
      greeting: `${Date.now()}`,
    };
  }),
});
