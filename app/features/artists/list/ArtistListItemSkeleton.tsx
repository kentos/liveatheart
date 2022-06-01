import { View, StyleSheet, Image, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from '../../../components/Themed';
import Heart from '../../favorites/Heart';
import { useEffect, useRef } from 'react';
import _ from 'lodash';

export const ITEM_HEIGHT = 80;

interface ArtistListItemSkeletonProps {
  imageUri?: string;
  _id?: string;
  name?: string;
  genre?: string;
  city?: string;
  country?: string;
}

function ArtistListItemSkeleton({
  imageUri,
  name,
  genre,
  city,
  country,
  _id,
}: ArtistListItemSkeletonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dur = useRef(_.random(500, 750));

  useEffect(() => {
    if (!imageUri || !name || !genre) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: dur.current,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.75,
            duration: dur.current,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [fadeAnim]);

  return (
    <View style={styles.wrapper}>
      {!!imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Animated.View style={[styles.image, styles.skeleton, { opacity: fadeAnim }]} />
      )}
      <View style={styles.info}>
        {!!name ? (
          <Text style={styles.name}>{name}</Text>
        ) : (
          <Animated.View style={[styles.skeletonrow, { height: 20, opacity: fadeAnim }]} />
        )}
        {!!genre ? (
          <Text style={styles.genre}>{genre || 'loading'}</Text>
        ) : (
          <Animated.View style={[styles.skeletonrow, { height: 14, opacity: fadeAnim }]} />
        )}
        {/* <Text style={styles.location}>
          {(city || country) && (
            <>
              <FontAwesome size={12} name="location-arrow" /> {city}, {country}
            </>
          )}
        </Text> */}
      </View>
      {_id && (
        <View style={styles.right}>
          <Heart artistid={_id} size={24} />
        </View>
      )}
    </View>
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
  skeleton: {
    backgroundColor: 'rgba(0, 0, 0, .07)',
  },
  skeletonrow: {
    backgroundColor: 'rgba(0, 0, 0, .07)',
    borderRadius: 40,
    marginBottom: 8,
    marginRight: 20,
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

export default ArtistListItemSkeleton;
