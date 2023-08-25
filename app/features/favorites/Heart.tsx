import { useCallback, useMemo } from 'react';
import useFavorites from './useFavorites';
import HeartButton from '../../components/HeartButton';

interface HeartProps {
  artistid: string;
  size?: number;
  inverted?: boolean;
  hiddenIfNotFaved?: boolean;
}

function Heart({ inverted, artistid, size = 18, hiddenIfNotFaved }: HeartProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFaved = useMemo(() => favorites.includes(artistid), [favorites, artistid]);
  const toggle = useCallback(() => {
    if (isFaved) {
      removeFavorite(artistid);
    } else {
      addFavorite(artistid);
    }
  }, [isFaved, artistid]);
  if (hiddenIfNotFaved && !isFaved) return null;
  return <HeartButton toggle={toggle} active={isFaved} size={size} inverted={inverted} />;
}

export default Heart;
