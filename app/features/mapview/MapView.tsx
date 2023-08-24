import { View, StyleSheet } from 'react-native';
import RNMapView, { Region, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Title } from '../../components/Texts';
import Colors from '../../constants/Colors';
import { trpc } from '../../libs/trpc';

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
  color?: string;
}

function Venue({ title, color }: Props) {
  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', paddingBottom: 5 }}>
      <View
        style={{
          backgroundColor: color ? color : Colors.light.tint,
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
          backgroundColor: color ? color : Colors.light.tint,
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

function MapView() {
  const venues = trpc.program.getVenuesForMap.useQuery(undefined, { staleTime: Infinity });
  const markers =
    venues.data?.map((v) => ({
      _id: String(v._id),
      title: v.name,
      coordinates: { latitude: v.coordinates.latitude, longitude: v.coordinates.longitude },
      color: v.color,
      type: v.type,
    })) ?? [];
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
          <Marker
            key={m._id}
            coordinate={m.coordinates}
            title={m.title}
            description={m.type || m.title}
          >
            <Venue title={m.title} color={m.color} />
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
