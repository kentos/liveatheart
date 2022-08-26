import { useQuery } from 'react-query';
import * as api from '../../libs/api';

function useSeminars(id?: string) {
  const { data } = useQuery({
    initialData: [] as Seminar[],
    queryKey: '/seminars',
    queryFn: async ({ queryKey }) => {
      const result = await api.get<Seminar[]>(queryKey);
      return result.data;
    },
  });

  return { data, seminar: data?.find((d) => d._id === id) };
}

export default useSeminars;
