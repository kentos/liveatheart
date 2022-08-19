import { View, StyleSheet } from 'react-native';
import RNMapView, { Region, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Title } from '../../components/Texts';
import Colors from '../../constants/Colors';

/**
 * TODO: For release https://docs.expo.dev/versions/latest/sdk/map-view/
 */

const initialRegion: Region = {
  latitude: 59.273948951983854,
  longitude: 15.213361651062245,
  latitudeDelta: 0.0122,
  longitudeDelta: 0.0121,
};

interface Props {
  title: string;
}

function Venue({ title }: Props) {
  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', paddingBottom: 5 }}>
      <View
        style={{
          backgroundColor: Colors.light.tint,
          padding: 8,
          paddingVertical: 6,
          borderRadius: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.light.border,
        }}
      >
        <Title color={'white'}>{title}</Title>
      </View>
      <View
        style={{
          transform: [{ rotate: '45deg' }],
          width: 14,
          height: 14,
          backgroundColor: Colors.light.tint,
          marginTop: -7,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: Colors.light.border,
          borderRightWidth: StyleSheet.hairlineWidth,
          borderRightColor: Colors.light.border,
        }}
      />
    </View>
  );
}

const markers = [
  {
    title: 'Örebro teater',
    coordinates: { latitude: 59.274509593553844, longitude: 15.213212972468996 },
  },
  {
    title: 'Makeriet',
    coordinates: { latitude: 59.27203222090211, longitude: 15.215537543764597 },
  },
  {
    title: 'Kvarteret & Co',
    coordinates: { latitude: 59.27271519120328, longitude: 15.214318300570216 },
  },
  {
    title: 'Konserthuset',
    coordinates: { latitude: 59.27258213865932, longitude: 15.208667570841358 },
  },
  {
    title: 'Clarion hotel',
    coordinates: { latitude: 59.27058467943606, longitude: 15.213788363004081 },
  },
  {
    title: 'Boulebar',
    coordinates: { latitude: 59.27580300273234, longitude: 15.217097594526175 },
  },
  {
    title: 'STÅ',
    coordinates: { latitude: 59.27588145543049, longitude: 15.217379897410652 },
  },
  {
    title: 'Nikolaikyrkan',
    coordinates: { latitude: 59.272371057072995, longitude: 15.211253553718388 },
  },
  {
    title: 'Coco Thai',
    coordinates: { latitude: 59.27629163408403, longitude: 15.215083277502819 },
  },
  {
    title: 'Kulturkvarteret',
    coordinates: { latitude: 59.27201329633869, longitude: 15.207447876576431 },
  },
  {
    title: 'Clarion Borgen',
    coordinates: { latitude: 59.27437919357558, longitude: 15.2121017660555 },
  },
  {
    title: 'Björnes',
    coordinates: { latitude: 59.27075669311238, longitude: 15.211335855921645 },
  },
  {
    title: 'Ingeborgs',
    coordinates: { latitude: 59.272340133490324, longitude: 15.217320294499059 },
  },
  {
    title: 'Satin',
    coordinates: { latitude: 59.271159645769885, longitude: 15.215619710383715 },
  },
  {
    title: 'Saluhallen',
    coordinates: { latitude: 59.27046495573426, longitude: 15.214211127080972 },
  },
  {
    title: "O'learys",
    coordinates: { latitude: 59.27286940010109, longitude: 15.212263184493013 },
  },
  {
    title: 'Örebro Slott',
    coordinates: { latitude: 59.27398312933889, longitude: 15.215252752823734 },
  },
  {
    title: 'Bio Roxy',
    coordinates: { latitude: 59.27505518012461, longitude: 15.215984481322486 },
  },
];

function MapView() {
  return (
    <View style={styles.container}>
      <RNMapView
        style={styles.map}
        initialRegion={initialRegion}
        showsCompass
        showsUserLocation
        showsMyLocationButton
        showsBuildings={false}
        showsIndoors={false}
        provider={PROVIDER_GOOGLE}
      >
        {markers.map((m) => (
          <Marker key={m.title} coordinate={m.coordinates} title={m.title} description={m.title}>
            <Venue title={m.title} />
          </Marker>
        ))}
      </RNMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapView;
