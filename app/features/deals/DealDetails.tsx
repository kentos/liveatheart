import { RouteProp, useRoute } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Body, Headline } from '../../components/Texts';
import { DealsStackParamList } from './DealsNavigator';
import useDeals from './useDeals';

function DealDetails() {
  const route = useRoute<RouteProp<DealsStackParamList, 'DealDetails'>>();
  const dealid = route.params.dealid;
  const { deal } = useDeals(dealid);
  return (
    <>
      <ScrollView>
        <Image source={{ uri: deal?.image }} style={styles.image} />
        <View style={styles.textWrapper}>
          <Headline>{deal?.title}</Headline>
          <Body>{deal?.text}</Body>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 320,
  },
  textWrapper: {
    padding: 16,
  },
});

export default DealDetails;
