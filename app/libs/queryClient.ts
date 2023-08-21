import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: true,
      // cacheTime: 1000 * 60 * 60 * 4, // 4 hours
    },
  },
});

export { queryClient };
