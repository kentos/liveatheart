import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SectionList, TouchableOpacity, View } from 'react-native';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { format, isSameDay } from '../../helpers/date';
import useFavorites from '../favorites/useFavorites';
import Colors from '../../constants/Colors';
import { useArtists } from '../artists/useArtists';
import ScheduleSectionHeader from './ScheduleSectionHeader';
import Slot from './Slot';
import { days } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

function storeSelection(selected: number) {
  AsyncStorage.setItem('~SCHEDULE-selectedDay', String(selected));
}

async function getStoredSelection(): Promise<number> {
  const value = await AsyncStorage.getItem('~SCHEDULE-selectedDay');
  return Number(value);
}

function Schedule() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const { artists } = useArtists();
  const faves = useFavorites((state) => state.favoriteIds);
  const selectedDate = useMemo(() => days[selectedDay], [selectedDay]);
  const navigation = useNavigation();

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
  }, [showFavorites]);

  useEffect(() => {
    storeSelection(selectedDay);
  }, [selectedDay]);

  useEffect(() => {
    async function restoreSelection() {
      const val = await getStoredSelection();
      if (val) {
        setSelectedDay(val);
      }
    }
    restoreSelection();
  }, []);

  const data = useMemo(
    () =>
      _(artists)
        .filter((a) => !!a.slots)
        .filter((a) => (showFavorites ? faves.includes(a._id) : true))
        .flatMap(
          (a) =>
            a.slots
              ?.filter((s) => isSameDay(s.eventAt, selectedDate))
              .map<SlotCombined>((b) => ({ ...b, ..._.pick(a, ['_id', 'name']) })) ?? []
        )
        .sortBy((a) => a.eventAt)
        .groupBy((a) => a.venue.externalid)
        .map((val) => ({
          title: val[0].venue.name,
          data: val,
        }))
        .value(),
    [showFavorites, artists, selectedDate]
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 8 }}>
        <SegmentedControl
          selectedIndex={selectedDay}
          values={_.map(days, (d) => _.upperFirst(format(d, 'shortday')))}
          onChange={(e) => {
            setSelectedDay(e.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
      {data?.length > 0 && (
        <SectionList
          style={{ flex: 1 }}
          sections={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Slot slot={item} />}
          renderSectionHeader={({ section }) => <ScheduleSectionHeader title={section.title} />}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

export default Schedule;
