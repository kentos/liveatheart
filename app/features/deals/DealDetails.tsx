import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Body, Headline } from '../../components/Texts';
import { DealsStackParamList } from './DealsNavigator';
import useDeals from './useDeals';
import RenderHTML, {
  MixedStyleDeclaration,
  MixedStyleRecord,
  defaultSystemFonts,
} from 'react-native-render-html';
import Colors from '../../constants/Colors';

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

function DealDetails() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<DealsStackParamList, 'DealDetails'>>();
  const dealid = route.params.dealid;
  const { deal } = useDeals(dealid);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: deal?.title,
    });
  }, [deal]);

  return (
    <>
      <ScrollView>
        <Image source={{ uri: deal?.image, cache: 'force-cache' }} style={styles.image} />
        <View style={styles.textWrapper}>
          <Headline>{deal?.title}</Headline>

          {!!deal?.description && (
            <RenderHTML
              source={{ html: deal.description }}
              contentWidth={width - 16}
              emSize={8}
              ignoredDomTags={['img']}
              baseStyle={baseStyle}
              systemFonts={systemFonts}
              tagsStyles={tagsStyle}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250,
  },
  textWrapper: {
    padding: 16,
  },
});

export default DealDetails;
