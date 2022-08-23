import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, SectionList, TouchableOpacity, View } from 'react-native';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isSameDay } from '../../helpers/date';
import useFavorites from '../favorites/useFavorites';
import Colors from '../../constants/Colors';
import { useArtists } from '../artists/useArtists';
import ScheduleSectionHeader from './ScheduleSectionHeader';
import Slot from './Slot';
import { days } from './constants';
import { Title } from '../../components/Texts';
import { useQuery } from 'react-query';
import { get } from '../../libs/api';

async function storeSelection(selected: number) {
  await AsyncStorage.setItem('SCHEDULE-selectedDay', String(selected));
}

async function getStoredSelection(): Promise<number> {
  const value = await AsyncStorage.getItem('SCHEDULE-selectedDay');
  return Number(value);
}

function PickAndChoose({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <Title color={Colors.light.tint}>{title}</Title>
        <FontAwesome
          size={20}
          color={Colors.light.tint}
          name="caret-down"
          style={{ marginLeft: 8 }}
        />
      </View>
    </TouchableOpacity>
  );
}

enum ScheduleCategory {
  CONCERTS = 'concerts',
  FILM = 'film',
  CONFERENCE = 'conference',
}

function useSchedule(category: ScheduleCategory = ScheduleCategory.CONCERTS) {
  const { data, refetch, isRefetching } = useQuery({
    queryKey: `/program/${category}`,
    queryFn: async ({ queryKey }) => {
      const result = await get<Artist[]>(queryKey);
      return result.data;
    },
  });

  return { data, refetch, isRefetching };
}

const dayMap: Record<number, string> = {
  0: 'wednesday',
  1: 'thursday',
  2: 'friday',
  3: 'saturday',
};

function Schedule() {
  const [category, setCategory] = useState(ScheduleCategory.CONCERTS);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const { artists } = useArtists();
  const faves = useFavorites((state) => state.favoriteIds);
  const selectedDate = useMemo(() => days[selectedDay], [selectedDay]);
  const navigation = useNavigation();
  const schedule = useSchedule(category);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <PickAndChoose
          title={_.upperFirst(category)}
          onPress={() =>
            Alert.alert('Choose category', undefined, [
              { text: 'Concerts', onPress: () => setCategory(ScheduleCategory.CONCERTS) },
              { text: 'Film', onPress: () => setCategory(ScheduleCategory.FILM) },
              { text: 'Conference', onPress: () => setCategory(ScheduleCategory.CONFERENCE) },
            ])
          }
        />
      ),
      headerRight: () =>
        category === ScheduleCategory.CONCERTS && (
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
  }, [showFavorites, selectedDay, category]);

  useEffect(() => {
    storeSelection(selectedDay);
  }, [selectedDay]);

  useEffect(() => {
    async function restoreSelection() {
      const val = await getStoredSelection();
      console.log('BAGA', val);
      if (val) {
        setSelectedDay(val);
      }
    }
    restoreSelection();
  }, []);

  const data = useMemo(
    () =>
      _(schedule.data)
        .filter((a) => !!a.slots)
        .filter((a) =>
          showFavorites && category === ScheduleCategory.CONCERTS ? faves.includes(a._id) : true
        )
        .flatMap(
          (a) =>
            a.slots
              ?.filter((s) => s.day === dayMap[selectedDay]) // isSameDay(s.eventAt, selectedDate))
              .map<SlotCombined>((b) => ({ ...b, ..._.pick(a, ['_id', 'name']) })) ?? []
        )
        .sortBy((a) => a.eventAt)
        .groupBy((a) => a.venue.externalid)
        .map((val) => ({
          title: val[0].venue.name,
          data: val,
        }))
        .sortBy((d) => d.title)
        .value(),
    [showFavorites, artists, selectedDate, schedule]
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
          refreshControl={
            <RefreshControl refreshing={schedule.isRefetching} onRefresh={schedule.refetch} />
          }
          sections={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Slot slot={item} hideHeart={category !== ScheduleCategory.CONCERTS} />
          )}
          renderSectionHeader={({ section }) => <ScheduleSectionHeader title={section.title} />}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

export default Schedule;
