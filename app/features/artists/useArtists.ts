import _ from 'lodash';
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../libs/api';

interface UseArtists {
  artists?: Artist[];
  artist?: Artist;
  reload: () => void;
  isReloading: boolean;
  isEmpty: boolean;
}

function useArtists(ids?: string | string[]): UseArtists {
  const { data, refetch, isInitialLoading } = useQuery<Artist[]>({
    initialData: [] as Artist[],
    queryKey: ['artists'],
    queryFn: async () => {
      const result = await get<Artist[]>('/artists');
      return result.data;
    },
  });
  const [isRefetching, setIsRefetching] = useState(false);

  console.log(data);

  const isEmpty = !isInitialLoading && data.length === 0;

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
    isEmpty,
    artists,
    artist,
    reload,
    isReloading: isRefetching,
  };
}

export { useArtists };
