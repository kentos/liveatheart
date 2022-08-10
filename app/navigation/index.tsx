import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Image } from 'react-native';

import Colors from '../constants/Colors';
import ModalScreen from '../screens/ModalScreen';

import ArtistDetails from '../features/artists/details/ArtistDetails';
import { RootStackParamList, RootTabParamList } from '../types';
// import FavoritesList from '../features/favorites/FavoritesList';
import MapView from '../features/mapview/MapView';
// import Schedule from '../features/schedule/Schedule';
// import DealsNavigator from '../features/deals/DealsNavigator';
import ArtistsList from '../features/artists/list/ArtistsList';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER_HEIGHT } from '../helpers/header';
import NewsList from '../features/news/NewsList';
import CloseButton from '../components/CloseButton';
import More from '../features/more/More';
import Tickets from '../features/more/Tickets/Tickets';
import WebView from '../features/webview/WebView';
import AboutApp from '../features/more/AboutApp';

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
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerLeft: () => <CloseButton style={{ marginLeft: 8 }} />,
        }}
      >
        <Stack.Screen name="Modal" component={ModalScreen} />
        <Stack.Screen name="Tickets" component={Tickets} />
        <Stack.Screen name="WebView" component={WebView} />
        <Stack.Screen name="AboutApp" component={AboutApp} options={{ title: 'About this app' }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

import Logo from '../assets/images/lah-sv.svg';

function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerLeft: () => (
          <Logo width={64} height={50} style={{ marginLeft: 8 }} fill={Colors.light.tint} />
        ),
        headerStyle: {
          height: insets.top + HEADER_HEIGHT,
        },
        headerTitleStyle: {
          color: Colors.light.tint,
          fontFamily: 'Archia-Regular',
          fontWeight: '400',
        },
        tabBarActiveTintColor: Colors.light.tint,
        tabBarStyle: {
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'Archia-Regular',
          fontWeight: '400',
        },
      }}
    >
      <BottomTab.Screen
        name="News"
        component={NewsList}
        options={{
          title: 'News',
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
          lazy: false,
        }}
      />
      <BottomTab.Screen
        name="ArtistsList"
        component={ArtistsList}
        options={{
          title: 'Artists',
          tabBarIcon: ({ color }) => <TabBarIcon name="music" color={color} />,
          lazy: false,
        }}
      />
      {/* <BottomTab.Screen
          name="Schedule"
          component={Schedule}
          options={{
            title: 'Program',
            tabBarIcon: ({ color }) => <TabBarIcon name="clock-o" color={color} />,
          }}
        /> */}
      <BottomTab.Screen
        name="MapView"
        component={MapView}
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      {/* <BottomTab.Screen
          name="MyFavorites"
          component={FavoritesList}
          options={{
            title: 'My artists',
            tabBarIcon: ({ color }) => <TabBarIcon name="heart-o" color={color} />,
          }}
        /> */}
      {/* <BottomTab.Screen
          name="Deals"
          component={DealsNavigator}
          options={{
            title: 'Deals',
            tabBarIcon: ({ color }) => <TabBarIcon name="money" color={color} />,
            headerShown: false,
            lazy: false,
          }}
        /> */}
      <BottomTab.Screen
        name="More"
        component={More}
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <TabBarIcon name="bars" color={color} />,
          lazy: false,
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
