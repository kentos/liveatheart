import { ScrollView, View } from 'react-native';
import { Body, Caption } from '../../components/Texts';
import Colors from '../../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

function HeartbeatList() {
  const navigation = useNavigation();
  const data = [];
  // const { data } = useQuery({
  //   queryKey: ['heartbeat', 'artists'],
  //   queryFn: async () => {
  //     const result = await get<
  //       { _id: string; count: number; artist: { _id: string; name: string } }[]
  //     >('/heartbeat/artists');
  //     return result.data;
  //   },
  // });
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Caption>Most hearted artists</Caption>
      {data?.map((d) => (
        <View
          key={d._id}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
            paddingVertical: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ArtistDetails', { artistid: d.artist._id });
            }}
          >
            <Body color={Colors.light.tint}>{d.artist.name}</Body>
          </TouchableOpacity>
          <Caption>{d.count}</Caption>
        </View>
      ))}
    </ScrollView>
  );
}

export default HeartbeatList;
