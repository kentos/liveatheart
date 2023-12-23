import { z } from "zod";
import { createAccount } from "../../features/auth/createAccount";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { createAuthToken } from "../../features/auth/tokens";

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
});
