import _ from 'lodash';
import { useQuery } from 'react-query';
import * as api from '../../libs/api';

interface UseArtists {
  artists?: Artist[];
  artist?: Artist;
}

function useArtists(ids?: string | string[]): UseArtists {
  const { data } = useQuery({
    initialData: [] as Artist[],
    queryKey: '/artists',
    queryFn: async ({ queryKey }) => {
      const result = await api.get<Artist[]>(queryKey);
      return result.data;
    },
  });

  if (data && ids) {
    if (_.isArray(ids)) {
      return {
        artists: data.filter((a) => ids.includes(a._id)),
      };
    }
    return { artist: data.filter((a) => a._id === ids).at(0) };
  }

  return {
    artists: data,
  };
}

export { useArtists };
