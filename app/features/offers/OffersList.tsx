import { useNavigation } from '@react-navigation/native';
import { Image, View, FlatList, Pressable } from 'react-native';
import { Text } from '../../components/Themed';
import useOffers from './useOffers';

function OfferItem({ offer }: { offer: Offer }) {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.navigate('OfferDetails', { offerid: offer.id })}>
      <View style={{ width: '100%', height: 200 }}>
        <Image source={{ uri: offer.image }} style={{ width: '100%', height: 200 }} />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,.35)',
            padding: 12,
          }}
        >
          <Text style={{ textTransform: 'capitalize', color: '#fff', fontSize: 16 }}>
            {offer.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function OffersList() {
  const { offers } = useOffers();
  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <OfferItem offer={item} />}
    />
  );
}

export default OffersList;
