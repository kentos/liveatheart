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
    coordinates: { latitude: 59.27461647679096, longitude: 15.213255222933574 },
  },
  {
    title: 'Makeriet',
    coordinates: { latitude: 59.27216401271949, longitude: 15.215540916046939 },
  },
  {
    title: 'Kvarteret',
    coordinates: { latitude: 59.27307546729554, longitude: 15.21427405041228 },
  },
  {
    title: 'Konserthuset',
    coordinates: { latitude: 59.27266903648588, longitude: 15.208752743337156 },
  },
  {
    title: 'Clarion hotel',
    coordinates: { latitude: 59.27060660875714, longitude: 15.21376690702946 },
  },
  {
    title: 'STÅ',
    coordinates: { latitude: 59.27593982889238, longitude: 15.217216377442716 },
  },
  {
    title: 'Nikolaikyrkan',
    coordinates: { latitude: 59.27246458547095, longitude: 15.211301842541536 },
  },
  {
    title: 'Coco Thai',
    coordinates: { latitude: 59.27636130165615, longitude: 15.215104262655535 },
  },
  {
    title: 'Kulturkvarteret',
    coordinates: { latitude: 59.27210310365262, longitude: 15.20749212908522 },
  },
  {
    title: 'Clarion Borgen',
    coordinates: { latitude: 59.27449395868637, longitude: 15.212154752184869 },
  },
  {
    title: 'Björnes',
    coordinates: { latitude: 59.27088125491953, longitude: 15.211366473396788 },
  },
  {
    title: 'Ingeborgs',
    coordinates: { latitude: 59.272439487775166, longitude: 15.217359195661455 },
  },
  {
    title: 'Boulebar',
    coordinates: { latitude: 59.27587162309436, longitude: 15.217074126249816 },
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
