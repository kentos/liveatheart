import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CloseButton from '../../components/CloseButton';
import Colors from '../../constants/Colors';
import { HEADER_HEIGHT } from '../../helpers/header';
import DealDetails from './DealDetails';
import DealsList from './DealsList';
import Logo from '../../assets/images/lah-sv.svg';

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
            <Logo width={64} height={50} style={{ marginLeft: 8 }} fill={Colors.light.tint} />
          ) : (
            <CloseButton back style={{ marginLeft: 8 }} />
          ),
        headerStyle: {
          height: insets.top + HEADER_HEIGHT,
        },
        headerTitleStyle: {
          color: Colors.light.tint,
          fontFamily: 'Archia-Thin',
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
