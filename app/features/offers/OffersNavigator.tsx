import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CloseButton from '../../components/CloseButton';
import Colors from '../../constants/Colors';
import { HEADER_HEIGHT } from '../../helpers/header';
import OfferDetails from './OfferDetails';
import OffersList from './OffersList';

export type OffersStackParamList = {
  OffersList: undefined;
  OfferDetails: { offerid: string };
};

const Stack = createStackNavigator<OffersStackParamList>();
function OffersNavigator() {
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
          fontFamily: 'HelveticaNeue',
          fontWeight: '400',
        },
      }}
    >
      <Stack.Screen name="OffersList" component={OffersList} options={{ title: 'Offers' }} />
      <Stack.Screen name="OfferDetails" component={OfferDetails} options={{ title: 'Offer' }} />
    </Stack.Navigator>
  );
}

export default OffersNavigator;
