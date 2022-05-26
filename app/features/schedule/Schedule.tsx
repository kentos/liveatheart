import { useLayoutEffect, useMemo, useState } from 'react';
import { SectionList, TouchableOpacity, View } from 'react-native';
import _ from 'lodash';
import { useArtists } from '../artists/useArtists';
import ScheduleSectionHeader from './ScheduleSectionHeader';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Slot from './Slot';
import { days } from './constants';
import { format, isSameDay } from '../../helpers/date';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import useFavorites from '../favorites/useFavorites';

const mockVenues: Record<string, { name: string }> = {
  abc123: {
    name: 'Satin',
  },
  def456: {
    name: 'Contan',
  },
};

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
            name={showFavorites ? 'heart' : 'heart-o'}
            style={{ marginRight: 16 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [showFavorites]);

  const data = useMemo(
    () =>
      _(artists)
        .filter((a) => !!a.slots)
        .filter((a) => (showFavorites ? faves.includes(a._id) : true))
        .flatMap(
          (a) =>
            a.slots
              ?.filter((s) => isSameDay(s.date, selectedDate))
              .map<SlotCombined>((b) => ({ ..._.pick(a, ['_id', 'name']), ...b })) ?? []
        )
        .sortBy((a) => a.date)
        .groupBy((a) => a.venue_id)
        .map((val, key) => ({
          title: mockVenues[key].name,
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
            setSelectedDay(() => e.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
      <SectionList
        style={{ flex: 1 }}
        sections={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Slot slot={item} />}
        renderSectionHeader={({ section }) => <ScheduleSectionHeader title={section.title} />}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

export default Schedule;
