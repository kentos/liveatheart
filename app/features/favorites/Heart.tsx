import { useCallback, useMemo } from 'react';
import useFavorites from './useFavorites';
import HeartButton from '../../components/HeartButton';

interface HeartProps {
  artistid: string;
  size?: number;
  inverted?: boolean;
}

function Heart({ inverted, artistid, size = 18 }: HeartProps) {
  const favorites = useFavorites((state) => state.favoriteIds);
  const [add, remove] = useFavorites((state) => [state.addFavorite, state.removeFavorite]);
  const isFaved = useMemo(() => favorites.includes(artistid), [favorites, artistid]);
  const toggle = useCallback(() => {
    if (isFaved) {
      remove(artistid);
    } else {
      add(artistid);
    }
  }, [isFaved, artistid]);
  return <HeartButton toggle={toggle} active={isFaved} size={size} inverted={inverted} />;
}

export default Heart;
