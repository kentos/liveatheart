import { Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { FlashList } from '@shopify/flash-list';
import { ITEM_HEIGHT } from '../artists/list/ArtistListItem';
import config from '../../constants/config';
import { RouterOutput } from '../../libs/trpc';

type Props = {
  time: string;
  slots: RouterOutput['program']['getScheduleByDay']['program'][0]['slots'];
};

export default function DateTimeList({ time, slots }: Props) {
  const { width } = useWindowDimensions();
  return (
    <View key={time} style={{ width: width }}>
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
  itemList: {
    flexDirection: 'row',
    borderBottomColor: Colors.light.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.light.tint,
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
