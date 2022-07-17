import { View, StyleSheet } from 'react-native';
import RNMapView, { Region, PROVIDER_GOOGLE, Marker } from 'react-native-maps';

/**
 * TODO: For release https://docs.expo.dev/versions/latest/sdk/map-view/
 */

const initialRegion: Region = {
  latitude: 59.272173,
  longitude: 15.2157919,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

function MapView() {
  return (
    <View style={styles.container}>
      <RNMapView
        style={styles.map}
        initialRegion={initialRegion}
        showsCompass
        showsUserLocation
        provider={PROVIDER_GOOGLE}
      >
        {/* <Marker
          coordinate={{ latitude: 59.271149, longitude: 15.2134323 }}
          title="Satin"
          description="Satin"
        /> */}
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
