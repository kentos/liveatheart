import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Headline } from '../../components/Texts';
import config from '../../constants/config';
import useNews from './useNews';
import Loading from '../../components/Loading';

interface NewsItemProps {
  news: News;
}

function NewsItem({ news }: NewsItemProps) {
  const navigation = useNavigation();
  const goTo = useCallback(() => {
    // navigation.navigate('WebView', { url: news.link, title: news.title });
    navigation.navigate('NewsArticle', { articleId: news._id });
  }, [navigation, news._id]);
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Pressable onPress={goTo}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: config.api + '/image?type=thumb&url=' + news.image, cache: 'force-cache' }}
          style={styles.itemImage}
          onLoadEnd={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <ActivityIndicator style={{ position: 'absolute', left: '50%', top: '50%' }} />
        )}
      </View>
      <View style={styles.itemText}>
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
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
    />
  );
}

const styles = StyleSheet.create({
  itemImage: { width: '100%', height: 200 },
  itemText: { marginHorizontal: 12, marginTop: 8, marginBottom: 16 },
});

export default NewsList;
