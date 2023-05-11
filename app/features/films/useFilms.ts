import { useQuery } from '@tanstack/react-query';
import * as api from '../../libs/api';

function useFilms(id?: string) {
  const { data } = useQuery<Seminar[]>({
    initialData: [],
    queryKey: ['films'],
    queryFn: async () => {
      const result = await api.get<Film[]>('/films');
      return result.data;
    },
  });

  return { data, film: data?.find((d) => d._id === id) };
}

export default useFilms;
