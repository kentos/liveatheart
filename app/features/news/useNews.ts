import { useCallback, useState } from 'react';
import { trpc, RouterOutput } from '../../libs/trpc';

type NewsArticle = RouterOutput['news']['getNews'][0];

function useNews(id?: string) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, refetch, isLoading, isInitialLoading } = trpc.news.getNews.useQuery();

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetch(), new Promise((res) => setTimeout(res, 750))]);
    setIsRefreshing(false);
  }, []);

  let single: NewsArticle | undefined;
  if (id) {
    single = data?.find((d) => d._id === id);
  }

  return {
    allNews: data || [],
    single,
    isRefreshing,
    refresh,
    isLoading: isLoading && isInitialLoading,
  };
}

export default useNews;
