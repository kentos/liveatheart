import _ from 'lodash';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import * as api from '../../libs/api';

interface UseArtists {
  artists?: Artist[];
  artist?: Artist;
  reload: () => void;
  isReloading: boolean;
}

function useArtists(ids?: string | string[]): UseArtists {
  const { data, refetch } = useQuery({
    initialData: [] as Artist[],
    queryKey: '/artists',
    queryFn: async ({ queryKey }) => {
      const result = await api.get<Artist[]>(queryKey);
      return result.data;
    },
  });
  const [isRefetching, setIsRefetching] = useState(false);

  const reload = useCallback(async () => {
    setIsRefetching(() => true);
    await Promise.all([refetch(), new Promise((res) => setTimeout(res, 750))]);
    setIsRefetching(() => false);
  }, [refetch]);

  let artists = data;
  let artist;
  if (data && ids) {
    if (_.isArray(ids)) {
      artists = data.filter((a) => ids.includes(a._id));
    }
    artist = data.filter((a) => a._id === ids)[0];
  }

  return {
    artists,
    artist,
    reload,
    isReloading: isRefetching,
  };
}

export { useArtists };
