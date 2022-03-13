import { useRoute, useNavigation } from '@react-navigation/native';
import { ScrollView, ImageBackground, View, StyleSheet } from 'react-native';
import { Text } from '../../../components/Themed';
import CloseButton from '../../../components/CloseButton';
import { useArtistsData } from '../hooks';
import Heart from '../../favorites/Heart';
import Layout from '../../../constants/Layout';

const HEIGHT = Layout.window.height - 40;

export interface ArtistDetailsParams {
  artistid: string;
}

function ArtistDetails() {
  const navigation = useNavigation();
  const { params } = useRoute() as { params: ArtistDetailsParams };
  const [artist] = useArtistsData(params.artistid);

  return (
    <>
      <ScrollView pagingEnabled decelerationRate={0} style={styles.view}>
        <ImageBackground source={{ uri: artist?.image }} style={[styles.page, styles.artistImage]}>
          <Text style={styles.artist}>{artist?.name}</Text>
          <Text style={styles.genre}>{artist?.genre}</Text>
          <Text>
            {artist?.city}, {artist?.country}
          </Text>
          <View style={{ marginTop: 16 }}>
            <Heart artistid={artist?.id} size={36} />
          </View>
        </ImageBackground>

        <View style={styles.page}>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>{artist?.description}</Text>
          </View>
          <View>
            <Text>Apa</Text>
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
    alignItems: 'center',
    paddingTop: HEIGHT / 5,
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
