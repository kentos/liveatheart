import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Headline } from '../../components/Texts';
import { View } from '../../components/Themed';
import { RootStackParamList } from '../../types';
import useNews from './useNews';

export interface NewsDetailsParams {
  id: string;
}

function NewsDetails() {
  const route = useRoute<RouteProp<RootStackParamList, 'NewsDetails'>>();
  const navigation = useNavigation();
  const { single: news } = useNews(route.params.id);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: news?.title,
    });
  }, []);
  return (
    <View>
      <Headline>{route.params.id}</Headline>
    </View>
  );
}

export default NewsDetails;
