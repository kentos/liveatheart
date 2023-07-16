import { trpc } from '../../libs/trpc';
import { Category, Day } from './types';

export default function useSchedule(category: Category, day: Day) {
  const { data, refetch, isLoading, isRefetching } = trpc.program.getScheduleByDay.useQuery(
    {
      category,
      day,
    },
    {
      staleTime: 1000 * 60 * 5, // 5 mins
    }
  );

  return { data, refetch, isRefetching, isLoading };
}
