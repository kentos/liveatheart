import { createStackNavigator } from '@react-navigation/stack';
import { Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CloseButton from '../../components/CloseButton';
import Colors from '../../constants/Colors';
import { HEADER_HEIGHT } from '../../helpers/header';
import DealDetails from './DealDetails';
import DealsList from './DealsList';

export type DealsStackParamList = {
  DealsList: undefined;
  DealDetails: { dealid: string };
};

const Stack = createStackNavigator<DealsStackParamList>();
function DealsNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'card',
        headerLeft: ({ canGoBack }) =>
          !canGoBack ? (
            <Image
              source={require('../../assets/images/lah-logo.png')}
              style={{ width: 52, height: 40, marginLeft: 8 }}
            />
          ) : (
            <CloseButton back style={{ marginLeft: 8 }} />
          ),
        headerStyle: {
          height: insets.top + HEADER_HEIGHT,
        },
        headerTitleStyle: {
          color: Colors.light.tint,
          fontFamily: Platform.select({ ios: 'HelveticaNeue' }),
          fontWeight: '400',
        },
      }}
    >
      <Stack.Screen name="DealsList" component={DealsList} options={{ title: 'Deals' }} />
      <Stack.Screen name="DealDetails" component={DealDetails} options={{ title: 'Deal' }} />
    </Stack.Navigator>
  );
}

export default DealsNavigator;
