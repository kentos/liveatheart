import create from 'zustand';
import { get, store } from '../../helpers/storage';
import * as api from '../../libs/api';

interface Favorites {
  favoriteIds: string[];

  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
}

const useFavorites = create<Favorites>((set) => ({
  favoriteIds: [],

  addFavorite: (id: string) => {
    set((state) => ({ favoriteIds: [...state.favoriteIds, id] }));
    api.post(`/me/artists/${id}`, {});
  },
  removeFavorite: (id: string) => {
    set((state) => ({ favoriteIds: state.favoriteIds.filter((fid) => fid !== id) }));
    api.del(`/me/artists/${id}`);
  },
}));

// Observe state
useFavorites.subscribe(({ favoriteIds }) => {
  store('@favoriteids', favoriteIds.join(';'));
});

// Restore state
(async function () {
  const stored = await get('@favoriteids');
  if (stored) {
    useFavorites.setState({
      favoriteIds: stored?.split(';') ?? [],
    });
  }
})();

export default useFavorites;
