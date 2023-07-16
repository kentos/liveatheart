import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Caption, Headline } from '../../components/Texts';
import config from '../../constants/config';
import useNews from './useNews';
import Loading from '../../components/Loading';
import { RouterOutput } from '../../libs/trpc';
import Colors from '../../constants/Colors';
import { format } from 'date-fns';

interface NewsItemProps {
  news: RouterOutput['news']['getNews'][0];
}

function NewsItem({ news }: NewsItemProps) {
  const navigation = useNavigation();
  const goTo = useCallback(() => {
    navigation.navigate('NewsArticle', { articleId: news._id });
  }, [navigation, news._id]);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Pressable onPress={goTo}>
      <View>
        <Image
          source={{
            uri: config.api + '/image?type=thumb&url=' + news.image,
            cache: 'force-cache',
          }}
          style={styles.itemImage}
          onLoadEnd={() => setImageLoaded(true)}
          resizeMode="stretch"
        />
        {!imageLoaded && (
          <ActivityIndicator style={{ position: 'absolute', left: '50%', top: '50%' }} />
        )}
      </View>
      <View style={styles.itemText}>
        {news.published && <Caption>{format(news.published, 'PP')}</Caption>}
        <Headline>{news.title}</Headline>
      </View>
    </Pressable>
  );
}

function NewsList() {
  const { allNews, isRefreshing, refresh, isLoading } = useNews();
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loading caption="Hold on!" />
      </View>
    );
  }
  return (
    <FlashList
      data={allNews}
      estimatedItemSize={250}
      renderItem={({ item }) => {
        return <NewsItem news={item} />;
      }}
      refreshControl={
        <RefreshControl
          tintColor={Colors.light.tabIconDefault}
          refreshing={isRefreshing}
          onRefresh={refresh}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  itemImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  itemText: { marginHorizontal: 12, marginTop: 4, marginBottom: 16 },
});

export default NewsList;
