import { getAllDeals } from "../../features/deals";
import { publicProcedure, createTRPCRouter } from "../trpc";

export default createTRPCRouter({
  getDeals: publicProcedure.query(async ({ ctx: { db } }) => {
    return getAllDeals(db);
  }),
});
