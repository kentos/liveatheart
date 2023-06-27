import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Image } from 'react-native';

import Colors from '../constants/Colors';

import ArtistDetails from '../features/artists/details/ArtistDetails';
import SeminarDetails from '../features/seminars/SeminarDetail';
import FilmDetails from '../features/films/FilmDetails';
import { RootStackParamList } from '../types';
// import FavoritesList from '../features/favorites/FavoritesList';
// import MapView from '../features/mapview/MapView';
// import Schedule from '../features/schedule/Schedule';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER_HEIGHT } from '../helpers/header';
import CloseButton from '../components/CloseButton';
import Tickets from '../features/more/Tickets/Tickets';
import WebView from '../features/webview/WebView';
import AboutApp from '../features/more/AboutApp';
import BottomTabNavigator from './BottomTabNavigator';
import Profile from '../features/profile/Profile';

export default function Navigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#fafafa' } }}
      >
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          color: Colors.light.tint,
          fontFamily: 'Archia-Thin',
          fontWeight: '400',
        },
      }}
    >
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Group
        screenOptions={{
          presentation: 'card',
          headerLeft: ({ canGoBack }) =>
            !canGoBack ? (
              <Image
                source={require('../assets/images/lah-logo.png')}
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
            fontFamily: 'Archia-Thin',
            fontWeight: '400',
          },
        }}
      >
        <Stack.Screen
          name="ArtistDetails"
          options={{ headerShown: false }}
          component={ArtistDetails}
        />
        <Stack.Screen
          name="SeminarDetails"
          options={{ headerShown: false }}
          component={SeminarDetails}
        />
        <Stack.Screen name="FilmDetails" options={{ headerShown: false }} component={FilmDetails} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerLeft: () => <CloseButton style={{ marginLeft: 8 }} />,
        }}
      >
        <Stack.Screen name="Tickets" component={Tickets} />
        <Stack.Screen name="WebView" component={WebView} />
        <Stack.Screen name="AboutApp" component={AboutApp} options={{ title: 'About this app' }} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
