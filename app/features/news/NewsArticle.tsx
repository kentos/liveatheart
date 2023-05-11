import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Body, Headline } from '../../components/Texts';
import useNews from './useNews';
import { NewsStackParamList } from './NewsNavigator';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import RenderHtml, {
  MixedStyleDeclaration,
  MixedStyleRecord,
  defaultSystemFonts,
} from 'react-native-render-html';
import { useCallback, useLayoutEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import config from '../../constants/config';
import HeartButton from '../../components/HeartButton';
import useToast from '../../hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { del, put } from '../../libs/api';
import { queryClient } from '../../libs/queryClient';
import useUser from '../../hooks/useUser';

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
  const [isLiked, setIsLiked] = useState((user._id && single?.hearts?.includes(user._id)) || false);
  const { toast } = useToast();
  const sendHeart = useMutation({
    mutationFn: async (add: boolean) => {
      if (add) {
        await put(`/news/${articleId}/hearts`, {});
      } else {
        await del(`/news/${articleId}/hearts`);
      }
    },
    onSuccess() {
      queryClient.invalidateQueries(['news']);
    },
  });

  const toggle = useCallback(async () => {
    if (isLiked) {
      await sendHeart.mutateAsync(false);
      setIsLiked(false);
    } else {
      await sendHeart.mutateAsync(true);
      setIsLiked((t) => {
        if (!t) {
          toast('Article hearted 🙌');
        }
        return !t;
      });
    }
  }, [isLiked]);

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
    <ScrollView style={{ padding: 16 }} contentContainerStyle={{ paddingBottom: 32 }}>
      <Headline>{single?.title}</Headline>
      {!!single?.image && (
        <Image
          source={{
            uri: config.api + '/image?type=thumb&url=' + single.image,
            cache: 'force-cache',
          }}
          style={styles.itemImage}
        />
      )}
      {single?.content && (
        <RenderHtml
          source={{ html: single?.content }}
          contentWidth={width - 16}
          emSize={8}
          ignoredDomTags={['img']}
          baseStyle={baseStyle}
          systemFonts={systemFonts}
          tagsStyles={tagsStyle}
        />
      )}
      {/* <View style={{ height: 24 }} />
      <Body>{single?.content}</Body> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemImage: { width: '100%', height: 300, marginVertical: 16 },
});

export default NewsArticle;
