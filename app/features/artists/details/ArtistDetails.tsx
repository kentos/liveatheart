import { useRoute, useNavigation } from '@react-navigation/native';
import { ScrollView, Image, View, StyleSheet, StatusBar } from 'react-native';
import { Headline, Body } from '../../../components/Texts';
import CloseButton from '../../../components/CloseButton';
import { useArtists } from '../useArtists';
import Heart from '../../favorites/Heart';
import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors';
import config from '../../../constants/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SpotifyEmbed from './SpotifyEmbed';
import ConcertRow from './ConcertRow';
import YoutubeEmbed from './YoutubeEmbed';
import _ from 'lodash';

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
        <View>
          <Image
            source={{
              uri: config.api + '/image?type=gray&url=' + artist?.image,
            }}
            style={[styles.artistImage]}
          />
          <View style={styles.overlay} />
          <View style={styles.text}>
            <View style={styles.artistName}>
              <Headline style={styles.artist}>{artist?.name}</Headline>
              {artist?.countryCode && (
                <Body style={styles.artistCountry}>{artist.countryCode}</Body>
              )}
            </View>
            <Body style={styles.genre}>{artist?.genre}</Body>
            {Number(artist?.concerts?.length) > 0 && (
              <View style={styles.concerts}>
                {artist?.concerts?.map((c) => (
                  <ConcertRow
                    key={c._id}
                    venue={c.venue.name}
                    day={_.upperFirst(c.day)}
                    time={c.time}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={{ paddingBottom: insets.bottom }}>
          <View style={styles.descriptionWrapper}>
            <Body>{artist?.description?.trim()}</Body>
          </View>
          {artist?.youtube && (
            <View style={{ marginHorizontal: 12, marginBottom: 12 }}>
              <YoutubeEmbed uri={artist.youtube} />
            </View>
          )}
          {artist?.spotify && (
            <View style={{ marginHorizontal: 12 }}>
              <SpotifyEmbed uri={artist?.spotify} />
            </View>
          )}
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
    left: 24,
    right: 24,
    flexDirection: 'column',
  },
  artistName: {
    flexDirection: 'row',
  },
  artistCountry: {
    color: Colors.light.background,
    marginLeft: 4,
    fontSize: 18,
  },
  artist: {
    fontSize: 28,
    fontFamily: 'Archia-Bold',
    color: Colors.light.background,
  },
  genre: {
    // fontSize: 16,
    color: Colors.light.background,
  },
  descriptionWrapper: {
    padding: 24,
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
  concerts: {
    borderTopColor: Colors.light.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 16,
    paddingTop: 16,
  },
});

export default ArtistDetails;
