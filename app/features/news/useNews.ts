import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../libs/api';

interface UseNewsProps {
  allNews: News[];
  single?: News;
  refresh: () => void;
  isRefreshing: boolean;
  isLoading: boolean;
}

function useNews(id?: string): UseNewsProps {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, refetch, isLoading, isInitialLoading } = useQuery<News[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const result = await get<News[]>('/news');
      return result.data;
    },
  });

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetch(), new Promise((res) => setTimeout(res, 750))]);
    setIsRefreshing(false);
  }, []);

  let single;
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
