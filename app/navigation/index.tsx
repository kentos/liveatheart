import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import ArtistsList from '../features/artists/list/ArtistsList';
import ArtistDetails from '../features/artists/details/ArtistDetails';
import { RootStackParamList, RootTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import FavoritesList from '../features/favorites/FavoritesList';
import MapView from '../features/mapview/MapView';
import Schedule from '../features/schedule/Schedule';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen
          name="ArtistDetails"
          options={{ headerShown: false }}
          component={ArtistDetails}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="ArtistsList"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent',
        },
        headerTitleStyle: {
          color: Colors.light.tint,
          fontFamily: 'HelveticaNeue',
          fontWeight: '400',
        },
        tabBarLabelStyle: {
          fontFamily: 'HelveticaNeue',
          fontWeight: '400',
        },
      }}
    >
      <BottomTab.Screen
        name="ArtistsList"
        component={ArtistsList}
        options={{
          title: 'Artister',
          tabBarIcon: ({ color }) => <TabBarIcon name="music" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="MapView"
        component={MapView}
        options={{
          title: 'Karta',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      {/* <BottomTab.Screen
        name="MyFavorites"
        component={FavoritesList}
        options={{
          title: 'Mina artister',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart-o" color={color} />,
        }}
      /> */}
      <BottomTab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          title: 'Schema',
          tabBarIcon: ({ color }) => <TabBarIcon name="clock-o" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabFour"
        component={TabTwoScreen}
        options={{
          title: 'Nyheter',
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="More"
        component={TabTwoScreen}
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <TabBarIcon name="bars" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}

function TabBarIcon(props: TabBarIconProps) {
  return <FontAwesome size={20} {...props} />;
}
