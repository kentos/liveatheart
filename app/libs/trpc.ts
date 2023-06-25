import { createTRPCProxyClient, createTRPCReact, httpBatchLink } from '@trpc/react-query';
import superjson from 'superjson';
import type { AppRouter } from '../../api/src/trpc/appRouter';
import useUserState from '../contexts/session/useUserState';
import { inferRouterOutputs } from '@trpc/server';

export const trpc = createTRPCReact<AppRouter>();
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const trcpVanilla = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'http://localhost:8080/trpc',
      async headers() {
        const token = useUserState.getState().authToken;
        return (
          token && {
            authorization: `Bearer ${useUserState.getState().authToken}`,
          }
        );
      },
    }),
  ],
});

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'http://localhost:8080/trpc',
      async headers() {
        const token = useUserState.getState().authToken;
        return (
          token && {
            authorization: `Bearer ${useUserState.getState().authToken}`,
          }
        );
      },
    }),
  ],
});
