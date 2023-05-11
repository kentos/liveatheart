import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../assets/images/lah-sv.svg';
import NewsNavigator from '../features/news/NewsNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types';
import { HEADER_HEIGHT } from '../helpers/header';
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import ArtistsList from '../features/artists/list/ArtistsList';
import DealsNavigator from '../features/deals/DealsNavigator';
import More from '../features/more/More';
import useUser from '../hooks/useUser';
import HeartbeatNavigator from '../features/heartbeat/HeartbeatNavigator';

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}

function TabBarIcon(props: TabBarIconProps) {
  return <FontAwesome size={20} {...props} />;
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const user = useUser();
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
        component={NewsNavigator}
        options={{
          title: 'News',
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
          lazy: false,
          headerShown: false,
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
      {user.role === 'admin' && (
        <BottomTab.Screen
          name="Heartbeat"
          component={HeartbeatNavigator}
          options={{
            title: 'Heartbeat',
            tabBarIcon: ({ color }) => <TabBarIcon name="dashcube" color={color} />,
            headerShown: false,
          }}
        />
      )}
      {/* <BottomTab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          title: 'Program',
          tabBarIcon: ({ color }) => <TabBarIcon name="clock-o" color={color} />,
          lazy: false,
        }}
      /> */}
      {/* <BottomTab.Screen
        name="MapView"
        component={MapView}
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      /> */}
      {/* <BottomTab.Screen
          name="MyFavorites"
          component={FavoritesList}
          options={{
            title: 'My artists',
            tabBarIcon: ({ color }) => <TabBarIcon name="heart-o" color={color} />,
          }}
        /> */}
      <BottomTab.Screen
        name="Deals"
        component={DealsNavigator}
        options={{
          title: 'Deals',
          tabBarIcon: ({ color }) => <TabBarIcon name="money" color={color} />,
          headerShown: false,
          lazy: false,
        }}
      />
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
