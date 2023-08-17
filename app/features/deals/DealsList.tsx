import { useNavigation } from '@react-navigation/native';
import { Image, View, FlatList, Pressable, Dimensions } from 'react-native';
import { Text } from '../../components/Themed';
import useDeals from './useDeals';
import FastImage from 'react-native-fast-image';

function DealItem({ deal }: { deal: Deal }) {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.navigate('DealDetails', { dealid: deal._id })}>
      <View
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width }}
      >
        <FastImage
          source={{ uri: deal.image }}
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width }}
          resizeMode={FastImage.resizeMode.cover}
        />
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
          <Text style={{ color: '#fff', fontSize: 16 }}>{deal.title}</Text>
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
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <DealItem deal={item} />}
    />
  );
}

export default DealsList;
