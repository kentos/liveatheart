import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { ObjectId } from "bson";
import verifyAuthtoken from "../lib/verifyAuthtoken";
import { getDbConnection } from "../database";

superjson.registerCustom<ObjectId, string>(
  {
    isApplicable: (v): v is ObjectId => v instanceof ObjectId,
    serialize: (value) => value.toString(),
    deserialize: (value) => new ObjectId(value),
  },
  "ObjectId",
);

export const createTRPCContext = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  const db = await getDbConnection();
  const requester = "";
  const authToken =
    req.headers.authorization?.substring(7) ?? req.cookies.auth_token;

  return { req, res, db, requester, authToken };
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
  if (!ctx.authToken) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing token" });
  }
  const user = verifyAuthtoken(ctx.authToken);
  if (!user) {
    throw new Error("Invalid token");
  }
  ctx.requester = user._id;
  if (!ctx.requester) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing requester" });
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
