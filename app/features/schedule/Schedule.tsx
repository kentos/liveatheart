import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import _ from 'lodash';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import useFavorites from '../favorites/useFavorites';
import Colors from '../../constants/Colors';
import SegmentedButtons from '../../components/SegmentedButtons/SegmentedButtons';
import DateTimeList from './DateTimeList';
import useSchedule from './useSchedule';
import { Category, Day, categories, days } from './types';
import { Body, Caption, Headline, Title } from '../../components/Texts';

function Schedule() {
  const { width: pageWidth } = useWindowDimensions();
  const [category, setCategory] = useState<Category>('Concerts');
  const [selectedDay, setSelectedDay] = useState<Day>('Wed');
  const { favorites } = useFavorites();
  const scroll = useRef<ScrollView>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const [showFavorites, setShowFavorites] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      schedule.refetch();
    }, [schedule.refetch])
  );

  const data = useMemo(() => {
    if (schedule.data?.program && showFavorites) {
      return (
        schedule.data?.program
          .filter((d) => d.slots.some((s) => favorites.includes(s.artist._id)))
          .map((d) => ({
            ...d,
            slots: d.slots.filter((s) => favorites.includes(s.artist._id)),
          })) || []
      );
    }
    return schedule.data?.program || [];
  }, [schedule]);

  const pages = useMemo(() => {
    const titles = _(data)
      .map((d) => d.time)
      .uniq()
      .value();
    return titles;
  }, [data]);

  const onPageChanged = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = e.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / pageWidth);
    setActivePageIndex(index);
  };

  const changePage = useCallback(
    (item: string) => {
      const index = pages.indexOf(item);
      setActivePageIndex(index);
      scroll.current?.scrollTo({ x: index * pageWidth, animated: true });
    },
    [pages, scroll, pageWidth]
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff' }}>
        <View style={{ paddingTop: 8 }}>
          <SegmentedButtons
            buttons={categories}
            active={category}
            onChange={(e) => setCategory(e as Category)}
          />
        </View>
        <View style={{ paddingTop: 8 }}>
          <SegmentedButtons
            buttons={days}
            active={selectedDay}
            onChange={(e) => setSelectedDay(e as Day)}
          />
        </View>
        <View style={{ paddingTop: 8, paddingBottom: 8 }}>
          <SegmentedButtons<string>
            buttons={pages}
            compact
            active={pages[activePageIndex]}
            onChange={changePage}
          />
        </View>
      </View>

      {data?.length > 0 && (
        <ScrollView ref={scroll} horizontal pagingEnabled onMomentumScrollEnd={onPageChanged}>
          {data.map((day) => (
            <DateTimeList key={day.time} time={day.time} slots={day.slots} />
          ))}
        </ScrollView>
      )}
      {data?.length === 0 && schedule.isFetched && <EmptySchedule />}
      {data?.length == 0 && schedule.isLoading && <Loading />}
    </View>
  );
}

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Title style={{ opacity: 0.5 }}>Loading...</Title>
    </View>
  );
}

function EmptySchedule() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Headline center>This selection is</Headline>
      <Headline>currently empty</Headline>
      <View style={{ height: 16 }} />
      <Body>the crew is working on</Body>
      <Body>fixing this!</Body>
    </View>
  );
}

export default Schedule;
