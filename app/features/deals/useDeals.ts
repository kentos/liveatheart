import { useQuery } from 'react-query';
import * as api from '../../libs/api';

function useDeals(id?: string): { deals?: Deal[]; deal?: Deal } {
  const { data } = useQuery<Deal[]>({
    initialData: [] as Deal[],
    queryKey: '/deals',
    queryFn: async (ctx) => {
      const result = await api.get<Deal[]>(ctx.queryKey);
      return result.data;
    },
  });
  return {
    deals: data,
    deal: data?.find((d) => d.id === id),
  };
}

export default useDeals;
