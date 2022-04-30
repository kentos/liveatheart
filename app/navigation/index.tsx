import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Image } from 'react-native';

import Colors from '../constants/Colors';
import ModalScreen from '../screens/ModalScreen';
import TabTwoScreen from '../screens/TabTwoScreen';

import ArtistDetails from '../features/artists/details/ArtistDetails';
import { RootStackParamList, RootTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import FavoritesList from '../features/favorites/FavoritesList';
import MapView from '../features/mapview/MapView';
import Schedule from '../features/schedule/Schedule';
import OffersList from '../features/offers/OffersList';
import Offer from '../features/offers/OfferDetails';
import OffersNavigator from '../features/offers/OffersNavigator';
import ArtistsList from '../features/artists/list/ArtistsList';

export default function Navigation() {
  return (
    <NavigationContainer
      theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#fafafa' } }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          color: Colors.light.tint,
          fontFamily: 'HelveticaNeue',
          fontWeight: '400',
        },
      }}
    >
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
  return (
    <BottomTab.Navigator
      initialRouteName="ArtistsList"
      screenOptions={{
        headerLeft: () => (
          <Image
            source={require('../assets/images/lah-logo.png')}
            style={{ width: 52, height: 40, marginLeft: 8 }}
          />
        ),
        tabBarActiveTintColor: Colors.light.tint,
        tabBarStyle: {
          borderTopWidth: 0,
        },
        headerStyle: {
          // backgroundColor: '#fff',
          //shadowColor: 'transparent',
          height: 90,
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
      <BottomTab.Screen
        name="MyFavorites"
        component={FavoritesList}
        options={{
          title: 'Mina artister',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart-o" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          title: 'Schema',
          tabBarIcon: ({ color }) => <TabBarIcon name="clock-o" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Offers"
        component={OffersNavigator}
        options={{
          title: 'Erbjudanden',
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="News"
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
          title: 'Mer',
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
