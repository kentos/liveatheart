/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtistDetailsParams } from './features/artists/details/ArtistDetails';
import { DealsStackParamList } from './features/deals/DealsNavigator';
import { FilmDetailsParams } from './features/films/FilmDetails';
import { SeminarDetailsParams } from './features/seminars/SeminarDetail';
import { WebViewProps } from './features/webview/WebView';
import { NewsStackParamList } from './features/news/NewsNavigator';

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
  SeminarDetails: SeminarDetailsParams;
  FilmDetails: FilmDetailsParams;
  Tickets: undefined;
  WebView: WebViewProps;
  DealDetails: { dealid: string };
  AboutApp: undefined;
  NewsArticle: { articleId: string };
  Profile: undefined;
  RemoveAccount: undefined;
  VenueSchedule: { venueId: string };
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
  News: NewsStackParamList;
  More: undefined;
  Heartbeat: undefined;
  Venues: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
