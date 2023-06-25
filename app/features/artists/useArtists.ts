import _ from 'lodash';
import { useCallback, useState } from 'react';
import { trpc } from '../../libs/trpc';

function useArtists(ids?: string | string[]) {
  const { data, refetch, isInitialLoading } = trpc.artists.getAllArtists.useQuery();
  const [isRefetching, setIsRefetching] = useState(false);

  const isEmpty = !isInitialLoading && data?.length === 0;

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
