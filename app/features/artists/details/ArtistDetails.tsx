import { useRoute, useNavigation } from '@react-navigation/native';
import { ScrollView, Image, View, StyleSheet } from 'react-native';
import { Text } from '../../../components/Themed';
import CloseButton from '../../../components/CloseButton';
import { useArtists } from '../useArtists';
import Heart from '../../favorites/Heart';
import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors';

const HEIGHT = Layout.window.height - 40;

export interface ArtistDetailsParams {
  artistid: string;
}

function ArtistDetails() {
  const navigation = useNavigation();
  const { params } = useRoute() as { params: ArtistDetailsParams };
  const { artist } = useArtists(params.artistid);

  return (
    <>
      <ScrollView pagingEnabled decelerationRate={0} style={styles.view}>
        <View style={[styles.page]}>
          <Image source={{ uri: artist?.image }} style={[styles.artistImage]} />
          <View style={styles.text}>
            <View style={{ marginRight: 16 }}>
              {artist && <Heart artistid={artist?._id} size={32} />}
            </View>
            <View>
              <Text style={styles.artist}>{artist?.name}</Text>
              <Text style={styles.genre}>{artist?.genre}</Text>
              {/* <Text>
                {artist?.city}, {artist?.country}
              </Text> */}
            </View>
          </View>
        </View>

        <View style={styles.page}>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>{artist?.description}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <CloseButton onPress={() => navigation.goBack()} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  page: {
    height: HEIGHT,
  },
  artistImage: {
    width: '100%',
    height: HEIGHT,
    position: 'absolute',
  },
  text: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.tint,
    opacity: 0.9,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  artist: {
    fontSize: 26,
    fontWeight: '600',
  },
  genre: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
  },
  descriptionWrapper: {
    padding: 16,
    flex: 1,
  },
  actionBar: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    shadowRadius: 10,
    shadowColor: 'rgba(0, 0, 0, .25)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.75,
  },
});

export default ArtistDetails;
