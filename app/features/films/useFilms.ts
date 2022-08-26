import { useQuery } from 'react-query';
import * as api from '../../libs/api';

function useFilms(id?: string) {
  const { data } = useQuery({
    initialData: [] as Seminar[],
    queryKey: '/films',
    queryFn: async ({ queryKey }) => {
      const result = await api.get<Film[]>(queryKey);
      return result.data;
    },
  });

  return { data, film: data?.find((d) => d._id === id) };
}

export default useFilms;
