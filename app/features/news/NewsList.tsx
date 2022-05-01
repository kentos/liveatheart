import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { Headline } from '../../components/Texts';
import useNews from './useNews';

interface NewsItemProps {
  news: News;
}

function NewsItem({ news }: NewsItemProps) {
  const navigation = useNavigation();
  const goTo = useCallback(() => {
    navigation.navigate('NewsDetails', { id: news.id });
  }, [navigation, news.id]);
  return (
    <Pressable onPress={goTo}>
      <View style={{ marginHorizontal: 8, marginVertical: 16 }}>
        <Headline>{news.title}</Headline>
      </View>
      <Image source={{ uri: news.image }} style={{ width: '100%', height: 200 }} />
    </Pressable>
  );
}

function NewsList() {
  const { allNews } = useNews();
  return (
    <FlatList
      data={allNews}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NewsItem news={item} />}
    />
  );
}

export default NewsList;
