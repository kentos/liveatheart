import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { format } from '../../helpers/date';
import Heart from '../favorites/Heart';
import { Body, Caption } from '../../components/Texts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScheduleCategory } from './types';

interface SlotProps {
  slot: SlotCombined;
  currentCategory: ScheduleCategory;
}

function Slot({ slot, currentCategory }: SlotProps) {
  const navigation = useNavigation();
  const onOpenArtist = useCallback(() => {
    if (!slot._id) {
      return;
    }
    if (currentCategory === ScheduleCategory.CONCERTS) {
      navigation.navigate('ArtistDetails', { artistid: slot._id });
    } else if (currentCategory === ScheduleCategory.CONFERENCE) {
      navigation.navigate('SeminarDetails', { seminarid: slot._id });
    } else if (currentCategory === ScheduleCategory.FILM) {
      navigation.navigate('FilmDetails', { filmid: slot._id });
    }
  }, [navigation]);

  const hideHeart = currentCategory !== ScheduleCategory.CONCERTS;

  return (
    <View style={styles.wrapper}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={onOpenArtist}>
          <Body>{slot.name}</Body>
          <View style={styles.date}>
            <Caption>
              <FontAwesome name="clock-o" color={Colors.light.tint} />{' '}
              {format(slot.eventAt, 'time')}
            </Caption>
          </View>
        </TouchableOpacity>
      </View>
      {!hideHeart && (
        <View style={styles.heart}>
          <Heart artistid={slot._id} />
        </View>
      )}
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
    fontSize: 12,
  },
  heart: {
    padding: 8,
  },
});

export default Slot;
