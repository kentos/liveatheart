import { useRoute, useNavigation } from '@react-navigation/native';
import { ScrollView, Image, View, StyleSheet, StatusBar } from 'react-native';
import { Headline, Body } from '../../components/Texts';
import CloseButton from '../../components/CloseButton';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import config from '../../constants/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import _ from 'lodash';
import ConcertRow from '../artists/details/ConcertRow';
import useFilms from './useFilms';

const HEIGHT = Layout.window.height * 0.85;

export interface FilmDetailsParams {
  filmid: string;
}

function FilmDetails() {
  const navigation = useNavigation();
  const { params } = useRoute() as { params: FilmDetailsParams };
  const { film } = useFilms(params.filmid);
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle={'light-content'} animated />
      <ScrollView style={styles.view}>
        <View>
          <Image
            source={{
              uri: config.api + '/image?type=gray&url=' + film?.image,
              cache: 'force-cache',
            }}
            style={[styles.image]}
          />
          <View style={styles.overlay} />
          <View style={styles.text}>
            <View style={styles.name}>
              <Headline style={styles.title} numberOfLines={4} adjustsFontSizeToFit>
                {film?.name}
              </Headline>
              {/* {film?.countryCode && (
                <Body style={styles.seminarCountry}>{artist.countryCode}</Body>
              )} */}
            </View>
            {/* <Body style={styles.genre}>{film?.genre}</Body> */}
            {Number(film?.slots?.length) > 0 && (
              <View style={styles.slots}>
                {film?.slots?.map((c) => (
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
            <Body>{film?.description?.trim()}</Body>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingTop: insets.top }]}>
        <CloseButton back onPress={() => navigation.goBack()} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  image: {
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
    bottom: 32,
    paddingHorizontal: 32,
    width: '100%',
    flexDirection: 'column',
  },
  name: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Archia-Bold',
    color: Colors.light.background,
  },
  // genre: {
  //   color: Colors.light.background,
  // },
  descriptionWrapper: {
    padding: 32,
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
  slots: {
    borderTopColor: Colors.light.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 16,
    paddingTop: 16,
  },
});

export default FilmDetails;
