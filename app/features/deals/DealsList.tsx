import { useNavigation } from '@react-navigation/native';
import { Image, View, FlatList, Pressable } from 'react-native';
import { Text } from '../../components/Themed';
import useDeals from './useDeals';

function DealItem({ deal }: { deal: Deal }) {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.navigate('DealDetails', { dealid: deal.id })}>
      <View style={{ width: '100%', height: 200 }}>
        <Image source={{ uri: deal.image }} style={{ width: '100%', height: 200 }} />
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
            {deal.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function DealsList() {
  const { deals } = useDeals();
  return (
    <FlatList
      data={deals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <DealItem deal={item} />}
    />
  );
}

export default DealsList;
