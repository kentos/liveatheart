import { createStackNavigator } from '@react-navigation/stack';
import NewsList from './NewsList';
import NewsArticle from './NewsArticle';
import Logo from '../../assets/images/lah-sv.svg';
import Colors from '../../constants/Colors';
import CloseButton from '../../components/CloseButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER_HEIGHT } from '../../helpers/header';

export type NewsStackParamList = {
  NewsList: undefined;
  NewsArticle: { articleId: string };
};

const Stack = createStackNavigator<NewsStackParamList>();

function NewsNavigator() {
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
      <Stack.Screen name="NewsList" component={NewsList} options={{ title: 'News' }} />
      <Stack.Screen name="NewsArticle" component={NewsArticle} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

export default NewsNavigator;
