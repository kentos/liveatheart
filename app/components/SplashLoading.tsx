import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

function SplashLoading() {
  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Animatable.Image
        animation="pulse"
        iterationCount="infinite"
        source={require('../assets/images/loading-clean.png')}
        resizeMode="cover"
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}

export default SplashLoading;
