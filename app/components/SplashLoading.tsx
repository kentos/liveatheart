import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

function SplashLoading() {
  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
      <Animatable.Image
        animation="pulse"
        duration={700}
        iterationDelay={0}
        iterationCount="infinite"
        source={require('../assets/images/loading-clean_3.png')}
        resizeMode="cover"
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}

export default SplashLoading;
