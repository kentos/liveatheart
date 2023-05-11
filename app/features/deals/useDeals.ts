import { useQuery } from '@tanstack/react-query';
import * as api from '../../libs/api';

function useDeals(id?: string): { deals?: Deal[]; deal?: Deal } {
  // const { data } = useQuery<Deal[]>({
  //   initialData: [],
  //   queryKey: ['deals'],
  //   queryFn: async () => {
  //     const result = await api.get<Deal[]>('/deals');
  //     return result.data;
  //   },
  // });
  const data = [];
  return {
    deals: data,
    deal: data?.find((d) => d._id === id),
  };
}

export default useDeals;
