import { createTRPCProxyClient, createTRPCReact, httpBatchLink } from '@trpc/react-query';
import superjson from 'superjson';
import type { AppRouter } from '../../api/src/trpc/appRouter';
import useUserState from '../contexts/session/useUserState';
import { inferRouterOutputs } from '@trpc/server';
import { getRefreshToken } from '../contexts/session/getRefreshToken';

export const trpc = createTRPCReact<AppRouter>();
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const trcpVanilla = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: __DEV__
        ? 'http://lah.local:3000/api/trpc'
        : 'https://liveatheart-production.up.railway.app/trpc',
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
      url: __DEV__
        ? 'http://lah.local:3000/api/trpc'
        : 'https://liveatheart-production.up.railway.app/trpc',
      fetch: async (url, options): Promise<Response> => {
        const res = await fetch(url, options);
        if (res.status === 401) {
          const stored = await getRefreshToken();
          if (!stored) {
            return res;
          }
          console.log('Renewing token');
          useUserState.getState().setAuthtoken(null);
          const token = await renewAuthToken(stored);
          return await fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              authorization: `Bearer ${token}`,
            },
          });
        }
        return res;
      },
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

let renewal: Promise<string> | null;

export async function renewAuthToken(refreshToken: string): Promise<string> {
  if (renewal) {
    return renewal;
  }
  renewal = (async () => {
    const result = await trcpVanilla.auth.renewAuthToken.mutate({ refreshToken });
    useUserState.getState().setAuthtoken(result.authToken);
    renewal = null;
    return result.authToken;
  })();
  return renewal;
}
