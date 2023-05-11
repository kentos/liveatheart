import { useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import useFavorites from '../favorites/useFavorites';
import Colors from '../../constants/Colors';
import { useArtists } from '../artists/useArtists';
import SegmentedButtons from '../../components/SegmentedButtons/SegmentedButtons';
import DateTimeList from './DateTimeList';
import useSchedule from './useSchedule';

const categories = ['Concerts', 'Day Party', 'Film', 'Conference'] as const;
export type Category = (typeof categories)[number];

const days = ['Wed', 'Thu', 'Fri', 'Sat'] as const;
export type Day = (typeof days)[number];

function Schedule() {
  const [category, setCategory] = useState<Category>('Concerts');
  const [selectedDay, setSelectedDay] = useState<Day>('Wed');

  const [showFavorites, setShowFavorites] = useState(false);
  const { artists } = useArtists();
  const faves = useFavorites((state) => state.favoriteIds);

  const navigation = useNavigation();
  const schedule = useSchedule(category, selectedDay);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowFavorites((c) => !c)}>
          <FontAwesome
            size={20}
            color={Colors.light.tint}
            name={showFavorites ? 'heart' : 'heart-o'}
            style={{ marginRight: 16 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [showFavorites, selectedDay, category, setVisible, visible, setCategory]);

  // useEffect(() => {
  //   storeSelection(selectedDay);
  // }, [selectedDay]);

  // useEffect(() => {
  //   async function restoreSelection() {
  //     const val = await getStoredSelection();
  //     if (val) {
  //       setSelectedDay(val);
  //     }
  //   }
  //   restoreSelection();
  // }, []);

  const data = useMemo(() => {
    return schedule.data || [];
  }, [showFavorites, artists, schedule]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff' }}>
        <SegmentedButtons
          buttons={categories}
          active={category}
          onChange={(e) => setCategory(e as Category)}
        />
        <SegmentedButtons
          buttons={days}
          active={selectedDay}
          onChange={(e) => setSelectedDay(e as Day)}
        />
      </View>
      {data?.length > 0 && (
        <View style={{ flex: 1 }}>
          <ScrollView horizontal>
            {data.map((day) => (
              <DateTimeList key={day.time} time={day.time} slots={day.slots} />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default Schedule;
