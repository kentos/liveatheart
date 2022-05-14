import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { get } from '../../libs/api';

interface UseNewsProps {
  allNews: News[];
  single?: News;
  refresh: () => void;
  isRefreshing: boolean;
}

function useNews(id?: string): UseNewsProps {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, refetch } = useQuery<News[]>({
    queryKey: '/news',
    queryFn: async ({ queryKey }) => {
      const result = await get<News[]>(queryKey);
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
    single = data?.find((d) => d.id === id);
  }
  console.log(data);
  return {
    allNews: data || [],
    single,
    isRefreshing,
    refresh,
  };
}

export default useNews;
