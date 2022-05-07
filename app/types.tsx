/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtistDetailsParams } from './features/artists/details/ArtistDetails';
import { DealsStackParamList } from './features/deals/DealsNavigator';
import { WebViewProps } from './features/webview/WebView';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  ArtistDetails: ArtistDetailsParams;
  Tickets: undefined;
  WebView: WebViewProps;
  DealDetails: { dealid: string };
  AboutApp: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  ArtistsList: undefined;
  MyFavorites: undefined;
  MapView: undefined;
  Schedule: undefined;
  Deals: DealsStackParamList;
  News: undefined;
  More: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
