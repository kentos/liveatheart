import { ObjectId } from "bson";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { type AppRouter } from "~/server/api/root";

superjson.registerCustom<ObjectId, string>(
  {
    isApplicable: (value): value is ObjectId => value instanceof ObjectId,
    serialize: (value) => value.toString(),
    deserialize: (value) => new ObjectId(value),
  },
  "ObjectId",
);

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://lah.local:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          async fetch(url, options) {
            return fetch(url, {
              ...options,
              headers: {
                ...options?.headers,
                "x-trpc-batch-size": "4",
              },
            }).catch((err) => {
              console.error(err);
              throw err;
            });
          },
        }),
      ],
    };
  },
  ssr: false,
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;