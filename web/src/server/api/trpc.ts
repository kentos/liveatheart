import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import verifyAuthtoken from "../lib/verifyAuthtoken";
import { getDbConnection } from "../database";

export const createTRPCContext = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  const db = await getDbConnection();
  let requester: string | null = null;

  if (req.headers.authorization) {
    const { authorization } = req.headers;
    const user = verifyAuthtoken(authorization.substring(7));
    if (!user) {
      throw new Error("Invalid token");
    }
    requester = user._id;
  }
  return { req, res, db, requester };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthed = t.middleware(async (opts) => {
  const { ctx } = opts;
  if (!ctx.requester) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      requester: ctx.requester,
    },
  });
});

export const createTRPCRouter = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
