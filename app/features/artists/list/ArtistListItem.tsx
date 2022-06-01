import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import ArtistListItemSkeleton from './ArtistListItemSkeleton';

interface ArtistListItemProps {
  artist: Partial<Artist>;
}

export const ITEM_HEIGHT = 80;

function ArtistListItem({ artist }: ArtistListItemProps) {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    if (artist._id) {
      navigation.navigate('ArtistDetails', { artistid: artist._id });
    }
  }, [navigation, artist._id]);

  return (
    <Pressable onPress={onPress}>
      <ArtistListItemSkeleton
        _id={artist._id}
        name={artist.name}
        imageUri={artist.image}
        city={artist.city}
        country={artist.country}
        genre={artist.genre}
      />
    </Pressable>
  );
}

export default ArtistListItem;
