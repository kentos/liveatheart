import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '../../api/src/trpc/appRouter';
import useUserState from '../contexts/session/useUserState';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8080/trpc',
      async headers() {
        return {
          authorization: `Bearer ${useUserState.getState().authToken}`,
        };
      },
    }),
  ],
});
