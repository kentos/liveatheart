import { trpc } from '../../libs/trpc';

function useDeals(id?: string): { deals?: Deal[]; deal?: Deal } {
  const { data } = trpc.deals.getDeals.useQuery(undefined, { initialData: [] });
  return {
    deals: data,
    deal: data?.find((d) => d._id === id),
  };
}

export default useDeals;
