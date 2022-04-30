import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OfferDetails from './OfferDetails';
import OffersList from './OffersList';

export type OffersStackParamList = {
  OffersList: undefined;
  OfferDetails: { offerid: string };
};

const Stack = createNativeStackNavigator<OffersStackParamList>();

function OffersNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OffersList" component={OffersList} />
      <Stack.Screen name="OfferDetails" component={OfferDetails} />
    </Stack.Navigator>
  );
}

export default OffersNavigator;
