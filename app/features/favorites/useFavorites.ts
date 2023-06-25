import { trpc } from '../../libs/trpc';
import { useCallback } from 'react';

function useFavorites() {
  const favorites = trpc.user.getFavorites.useQuery(undefined, {
    initialData: [],
    cacheTime: Infinity,
  });

  const utils = trpc.useContext();

  const setHeart = trpc.artists.setHeart.useMutation({
    async onMutate(variables: { artistId: string }) {
      await utils.user.getFavorites.cancel();
      utils.user.getFavorites.setData(undefined, [...favorites.data, variables.artistId]);
    },
    onSettled() {
      utils.user.getFavorites.refetch();
    },
  });
  const removeHeart = trpc.artists.removeHeart.useMutation({
    async onMutate(variables: { artistId: string }) {
      await utils.user.getFavorites.cancel();
      utils.user.getFavorites.setData(
        undefined,
        favorites.data.filter((id) => id !== variables.artistId)
      );
    },
    onSettled() {
      utils.user.getFavorites.refetch();
    },
  });

  const addFavorite = useCallback((artistId: string) => {
    setHeart.mutate({ artistId });
  }, []);

  const removeFavorite = useCallback((artistId: string) => {
    removeHeart.mutate({ artistId });
  }, []);

  return {
    favorites: favorites.data,
    addFavorite,
    removeFavorite,
  };
}

export default useFavorites;
