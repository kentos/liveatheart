import { Image } from 'react-native';
import Colors from '../constants/Colors';

export const defaultNavigatorScreenOptions = {
  headerLeft: () => (
    <Image
      source={require('../assets/images/lah-logo.png')}
      style={{ width: 52, height: 40, marginLeft: 8 }}
    />
  ),
  headerStyle: {
    // backgroundColor: '#fff',
    // shadowColor: 'transparent',
    height: 90,
  },
};

export const tabsScreenOptions = {
  tabBarActiveTintColor: Colors.light.tint,
  tabBarStyle: {
    borderTopWidth: 0,
  },
  headerTitleStyle: {
    color: Colors.light.tint,
    fontFamily: 'Archia-Thin',
    fontWeight: '400',
  },
  tabBarLabelStyle: {
    fontFamily: 'Archia-Thin',
    fontWeight: '400',
  },
};
