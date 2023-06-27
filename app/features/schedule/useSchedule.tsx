import { Category, Day } from './Schedule';

export default function useSchedule(category: Category, day: Day) {
  // const { data, refetch, isRefetching } = useQuery({
  //   queryKey: ['program', category, day],
  //   queryFn: async () => {
  //     const result = await get<
  //       { time: string; slots: { artist: Artist; venue: { name: string } }[] }[]
  //     >(`/program/${category.toLowerCase()}/${day.toLowerCase()}`);
  //     return result.data;
  //   },
  // });

  const data = [];
  const refetch = () => {};
  const isRefetching = false;

  return { data, refetch, isRefetching };
}
