import { createStackNavigator } from '@react-navigation/stack';
import HeartbeatList from './HeartbeatList';
import Logo from '../../assets/images/lah-sv.svg';
import CloseButton from '../../components/CloseButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER_HEIGHT } from '../../helpers/header';
import Colors from '../../constants/Colors';

export type HeartbeatStackParamList = {
  HeartbeatList: undefined;
};

const Stack = createStackNavigator<HeartbeatStackParamList>();

function HeartbeatNavigator() {
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
          fontFamily: 'Archia-Regular',
          fontWeight: '400',
        },
      }}
    >
      <Stack.Screen
        name="HeartbeatList"
        component={HeartbeatList}
        options={{ title: 'Heartbeat' }}
      />
    </Stack.Navigator>
  );
}

export default HeartbeatNavigator;
