import { useQuery } from 'react-query';
import { get } from '../../libs/api';

function useNews(id?: string): {
  allNews: News[];
  single?: News;
} {
  const { data } = useQuery<News[]>({
    queryKey: '/news',
    queryFn: async ({ queryKey }) => {
      const result = await get<News[]>(queryKey);
      return result.data;
    },
  });
  let single;
  if (id) {
    single = data?.find((d) => d.id === id);
  }
  return {
    allNews: data || [],
    single,
  };
}

export default useNews;
