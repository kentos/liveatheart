import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Body, Headline } from '../../components/Texts';
import { OffersStackParamList } from './OffersNavigator';
import useOffers from './useOffers';

function Offer() {
  const route = useRoute<RouteProp<OffersStackParamList, 'OfferDetails'>>();
  const offerid = route.params.offerid;
  const {
    offers: [offer],
  } = useOffers(offerid);
  return (
    <>
      <ScrollView>
        <Image source={{ uri: offer.image }} style={styles.image} />
        <View style={styles.textWrapper}>
          <Headline>{offer.title}</Headline>
          <Body>{offer.text}</Body>
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

export default Offer;
