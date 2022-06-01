import { useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useFavorites from './useFavorites';
import Colors from '../../constants/Colors';

interface HeartProps {
  artistid: string;
  size?: number;
  inverted?: boolean;
}

const getColor = (inverted: boolean, isFaved: boolean) =>
  isFaved ? (inverted ? '#fff' : '#e00') : inverted ? '#fff' : Colors.light.tint;

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
  return (
    <TouchableOpacity
      onPress={toggle}
      hitSlop={{ left: size / 2, right: size / 2, bottom: size / 2, top: size / 2 }}
    >
      <FontAwesome
        name={isFaved ? 'heart' : 'heart-o'}
        size={size}
        color={getColor(inverted || false, isFaved)}
      />
    </TouchableOpacity>
  );
}

export default Heart;
