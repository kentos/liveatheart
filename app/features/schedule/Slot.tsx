import { FontAwesome } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { format } from '../../helpers/date';
import Heart from '../favorites/Heart';

interface SlotProps {
  slot: SlotCombined;
}

function Slot({ slot }: SlotProps) {
  return (
    <View style={styles.wrapper}>
      <View style={{ flex: 1 }}>
        <Text style={styles.artist}>{slot.name}</Text>
        <View style={styles.date}>
          <Text style={styles.textDate}>
            <FontAwesome name="calendar-o" color={Colors.light.tint} /> {format(slot.date, 'short')}
          </Text>
          <Text style={styles.textTime}>
            <FontAwesome name="clock-o" color={Colors.light.tint} /> {format(slot.date, 'time')}
          </Text>
        </View>
      </View>
      <View style={styles.heart}>
        <Heart artistid={slot.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    borderBottomColor: 'rgba(0,0,0,.15)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  artist: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    flexDirection: 'row',
    marginTop: 4,
  },
  textDate: {
    fontSize: 12,
  },
  textTime: {
    marginLeft: 16,
    fontSize: 12,
  },
  heart: {
    padding: 8,
  },
});

export default Slot;
