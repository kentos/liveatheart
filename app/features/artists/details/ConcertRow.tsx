import { StyleSheet, View } from 'react-native';
import { Body } from '../../../components/Texts';
import Colors from '../../../constants/Colors';

interface Props {
  venue: string;
  day: string;
  time: string;
}

function ConcertRow({ venue, day, time }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.venue}>
        <Body bold color={Colors.light.background} numberOfLines={1}>
          {venue}
        </Body>
      </View>
      <View style={styles.day}>
        <Body color={Colors.light.background}>{day}</Body>
      </View>
      <View style={styles.time}>
        <Body color={Colors.light.background}>{time}</Body>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingRight: 24,
  },
  venue: {
    flex: 1,
  },
  day: {},
  time: {
    width: 66,
    alignItems: 'flex-end',
  },
});

export default ConcertRow;
