import { Pressable, View, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../../components/Themed';
import Heart from '../../favorites/Heart';
import { useCallback } from 'react';

interface ArtistListItemProps {
  artist: Artist;
}

export const ITEM_HEIGHT = 80;

function ArtistListItem({ artist }: ArtistListItemProps) {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    navigation.navigate('ArtistDetails', { artistid: artist.id });
  }, [navigation, artist.id]);

  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        <Image source={{ uri: artist.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{artist.name}</Text>
          <Text style={styles.genre}>{artist.genre}</Text>
          <Text style={styles.location}>
            <FontAwesome size={12} name="location-arrow" /> {artist.city}, {artist.country}
          </Text>
        </View>
        <View style={styles.right}>
          <Heart artistid={artist.id} size={20} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 14,
  },
  genre: {
    color: 'rgba(0,0,0,.45)',
    marginVertical: 4,
    fontSize: 14,
  },
  location: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  right: {
    paddingHorizontal: 16,
  },
});

export default ArtistListItem;
