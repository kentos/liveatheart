import { Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { Title } from '../../components/Texts';
import { FlashList } from '@shopify/flash-list';
import { ITEM_HEIGHT } from '../artists/list/ArtistListItem';
import config from '../../constants/config';

type Props = {
  time: string;
  slots: {
    artist: Artist;
    venue: { name: string };
  }[];
};

export default function DateTimeList({ time, slots }: Props) {
  const { width } = useWindowDimensions();
  return (
    <View key={time} style={{ width: width * 0.9 }}>
      <View style={styles.listTitle}>
        <Title>{time}</Title>
      </View>
      <FlashList
        data={slots}
        estimatedItemSize={ITEM_HEIGHT}
        renderItem={({ item }) => {
          return (
            <View style={styles.itemList}>
              <Image
                source={{
                  uri: config.api + '/image?type=thumb&url=' + item.artist.image,
                  cache: 'force-cache',
                }}
                style={styles.image}
              />
              <View style={styles.itemText}>
                <Text style={styles.name}>{item.artist.name}</Text>
                <Text style={styles.venue}>{item.venue.name}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listTitle: {
    backgroundColor: Colors.light.background,
    borderBottomColor: Colors.light.border,
    borderBottomWidth: 1,
    padding: 8,
  },
  itemList: {
    flexDirection: 'row',
    borderBottomColor: Colors.light.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
  },
  name: {
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Archia-Medium',
  },
  venue: {
    color: 'rgba(0,0,0,.45)',
    marginVertical: 4,
    fontSize: 14,
  },
  itemText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 8,
  },
});
