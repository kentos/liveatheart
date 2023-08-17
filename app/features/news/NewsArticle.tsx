import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Headline } from '../../components/Texts';
import useNews from './useNews';
import { NewsStackParamList } from './NewsNavigator';
import { Dimensions, Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import RenderHtml, {
  MixedStyleDeclaration,
  MixedStyleRecord,
  defaultSystemFonts,
} from 'react-native-render-html';
import { useCallback, useLayoutEffect } from 'react';
import Colors from '../../constants/Colors';
import config from '../../constants/config';
import HeartButton from '../../components/HeartButton';
import useToast from '../../hooks/useToast';
import useUser from '../../hooks/useUser';
import { trpc } from '../../libs/trpc';
import FastImage from 'react-native-fast-image';

const baseStyle: MixedStyleDeclaration = {
  color: Colors.light.text,
  fontSize: 14,
  lineHeight: 24,
  fontFamily: 'Archia-Regular',
};

const tagsStyle: MixedStyleRecord = {
  em: { fontFamily: 'Archia-Bold' },
  strong: { fontFamily: 'Archia-Bold' },
  p: { marginBottom: 4 },
};

const systemFonts = [
  ...defaultSystemFonts,
  'Archia-Thin',
  'Archia-Medium',
  'Archia-Bold',
  'Archia-Regular',
];

function ArticleHeart({ articleId }: { articleId?: string }) {
  const user = useUser();
  const { single } = useNews(articleId);
  const isLiked = (user._id && single?.hearts?.includes(user._id)) || false;
  const { toast } = useToast();

  const utils = trpc.useContext();

  const setHeart = trpc.news.setHeart.useMutation({
    onMutate({ articleId }) {
      const data = utils.news.getNews.getData();
      if (data) {
        const newData = data.reduce((previous, cur) => {
          if (cur._id === articleId) {
            cur.hearts?.push(user._id!);
          }
          return [...previous, cur];
        }, [] as typeof data);
        utils.news.getNews.cancel();
        utils.news.getNews.setData(undefined, newData);
        toast('Article hearted 🙌');
      }
    },
    onSuccess() {
      utils.news.getNews.invalidate();
    },
  });
  const removeHeart = trpc.news.removeHeart.useMutation({
    onMutate() {
      const data = utils.news.getNews.getData();
      if (data) {
        const newData = data.reduce((previous, cur) => {
          if (cur._id === articleId) {
            cur.hearts = cur.hearts?.filter((t) => t !== user._id);
          }
          return [...previous, cur];
        }, [] as typeof data);
        utils.news.getNews.cancel();
        utils.news.getNews.setData(undefined, newData);
      }
    },
    onSuccess() {
      utils.news.getNews.invalidate();
    },
  });

  const toggle = useCallback(() => {
    if (!single) {
      return;
    }
    if (isLiked) {
      removeHeart.mutate({ articleId: single._id });
    } else {
      setHeart.mutate({ articleId: single._id });
    }
  }, [single, isLiked]);

  if (!articleId) {
    return null;
  }
  return (
    <View style={{ marginRight: 16 }}>
      <HeartButton toggle={toggle} active={isLiked} size={24} />
    </View>
  );
}

function NewsArticle() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<NewsStackParamList, 'NewsArticle'>>();
  const { single } = useNews(route.params?.articleId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: single?.title,
      headerRight: () => <ArticleHeart articleId={single?._id} />,
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ padding: 16 }}>
        <Headline>{single?.title}</Headline>
      </View>
      {!!single?.image && (
        <FastImage
          source={{
            uri: config.api + '/image?type=thumb&url=' + single.image,
          }}
          style={styles.itemImage}
        />
      )}
      {single?.content && (
        <View style={{ padding: 16 }}>
          <RenderHtml
            source={{ html: single?.content }}
            contentWidth={width - 16}
            emSize={8}
            ignoredDomTags={['img']}
            baseStyle={baseStyle}
            systemFonts={systemFonts}
            tagsStyles={tagsStyle}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemImage: { width: Dimensions.get('window').width, height: Dimensions.get('window').width },
});

export default NewsArticle;
