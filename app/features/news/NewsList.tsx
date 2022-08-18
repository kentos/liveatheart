import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, Image, Pressable, RefreshControl, View, StyleSheet } from 'react-native';
import { Headline } from '../../components/Texts';
import useNews from './useNews';

interface NewsItemProps {
  news: News;
}

function NewsItem({ news }: NewsItemProps) {
  const navigation = useNavigation();
  const goTo = useCallback(() => {
    navigation.navigate('WebView', { url: news.link, title: news.title });
  }, [navigation, news._id]);
  return (
    <Pressable onPress={goTo}>
      <Image source={{ uri: news.image, cache: 'force-cache' }} style={styles.itemImage} />
      <View style={styles.itemText}>
        <Headline>{news.title}</Headline>
      </View>
    </Pressable>
  );
}

function NewsList() {
  const { allNews, isRefreshing, refresh } = useNews();
  return (
    <FlatList
      data={allNews}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <NewsItem news={item} />}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
    />
  );
}

const styles = StyleSheet.create({
  itemImage: { width: '100%', height: 200 },
  itemText: { marginHorizontal: 12, marginTop: 8, marginBottom: 16 },
});

export default NewsList;
