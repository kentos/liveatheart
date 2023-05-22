import { useQuery } from '@tanstack/react-query';
import { get } from '../../libs/api';
import { Category, Day } from './Schedule';

export default function useSchedule(category: Category, day: Day) {
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ['program', category, day],
    queryFn: async () => {
      const result = await get<
        { time: string; slots: { artist: Artist; venue: { name: string } }[] }[]
      >(`/program/${category.toLowerCase()}/${day.toLowerCase()}`);
      return result.data;
    },
  });

  return { data, refetch, isRefetching };
}