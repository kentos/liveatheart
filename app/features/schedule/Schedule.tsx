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
        .filter((a) => !!a.concerts)
        .filter((a) => (showFavorites ? faves.includes(a._id) : true))
        .flatMap(
          (a) =>
            a.concerts
              ?.filter((s) => isSameDay(s.eventAt, selectedDate))
              .map<ConcertCombined>((b) => ({ ..._.pick(a, ['_id', 'name']), ...b })) ?? []
        )
        .sortBy((a) => a.eventAt)
        .groupBy((a) => a.venue._id)
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
        {data?.length > 0 && (
          <SegmentedControl
            selectedIndex={selectedDay}
            values={_.map(days, (d) => _.upperFirst(format(d, 'shortday')))}
            onChange={(e) => {
              setSelectedDay(() => e.nativeEvent.selectedSegmentIndex);
            }}
          />
        )}
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
