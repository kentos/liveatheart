import { useRoute, useNavigation } from '@react-navigation/native';
import { ScrollView, Image, View, StyleSheet, StatusBar } from 'react-native';
import { Text } from '../../../components/Themed';
import CloseButton from '../../../components/CloseButton';
import { useArtists } from '../useArtists';
import Heart from '../../favorites/Heart';
import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors';
import config from '../../../constants/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEIGHT = Layout.window.height * 0.85;

export interface ArtistDetailsParams {
  artistid: string;
}

function ArtistDetails() {
  const navigation = useNavigation();
  const { params } = useRoute() as { params: ArtistDetailsParams };
  const { artist } = useArtists(params.artistid);
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle={'light-content'} animated />
      <ScrollView style={[styles.view]}>
        <View style={[styles.page]}>
          <Image
            source={{
              uri: config.api + '/image?type=gray&url=' + artist?.image,
              cache: 'force-cache',
            }}
            style={[styles.artistImage]}
          />
          <View style={styles.overlay} />
          <View style={styles.text}>
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

      <View style={[styles.actionBar, { paddingTop: insets.top }]}>
        <CloseButton back onPress={() => navigation.goBack()} />
        {artist && <Heart inverted artistid={artist?._id} size={32} />}
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
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: HEIGHT,
    backgroundColor: Colors.light.tint,
    opacity: 0.65,
  },
  text: {
    position: 'absolute',
    bottom: 24,
    right: 8,
    flexDirection: 'row',
  },
  artist: {
    fontSize: 32,
    color: Colors.light.background,
  },
  genre: {
    fontSize: 16,
    color: Colors.light.background,
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
    top: 8,
    left: 16,
    right: 16,
    shadowRadius: 10,
    shadowColor: 'rgba(0, 0, 0, .25)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.75,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ArtistDetails;
