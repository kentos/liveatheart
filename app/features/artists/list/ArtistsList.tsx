import { useState, useMemo, useEffect } from 'react';
import { LayoutAnimation, View, RefreshControl, StyleSheet } from 'react-native';
import _ from 'lodash';
import ArtistListItem, { ITEM_HEIGHT } from './ArtistListItem';
import { useArtists } from '../useArtists';
import useFavorites from '../../favorites/useFavorites';
import SectionHeader from './SectionHeader';
import ArtistListItemSkeleton from './ArtistListItemSkeleton';
import EmptyFaveList from './EmptyFaveList';
import { Body } from '../../../components/Texts';
import { FlashList } from '@shopify/flash-list';
import Colors from '../../../constants/Colors';
import SegmentedButtons from '../../../components/SegmentedButtons';
import { RouterOutput } from '../../../libs/trpc';

const segments = ['A-Z', 'Genres', 'Faves'] as const;
type Category = (typeof segments)[number];

function emptyList() {
  return [
    { _id: 'skeleton_1' },
    { _id: 'skeleton_2' },
    { _id: 'skeleton_3' },
    { _id: 'skeleton_4' },
    { _id: 'skeleton_5' },
    { _id: 'skeleton_6' },
    { _id: 'skeleton_7' },
    { _id: 'skeleton_8' },
  ];
}

type Artists = RouterOutput['artists']['getAllArtists'];

function assembleList(
  all: Artists,
  category: (typeof segments)[number],
  genre: string,
  favorites?: string[]
) {
  if (category === 'Genres') {
    return _(all)
      .filter((a) => a.genre === genre)
      .value();
  }
  if (category === 'Faves') {
    all = all?.filter((a) => favorites?.includes(a._id));
  }
  return _(all)
    .sortBy((a) => a.name)
    .value();
}

function ArtistsList() {
  const [category, setCategory] = useState<Category>('A-Z');
  const { favorites } = useFavorites();
  const { artists: allArtists, reload, isReloading, isEmpty } = useArtists();

  const allGenres = useMemo(() => {
    const s = new Set<string>();
    allArtists?.forEach((a) => {
      s.add(a.genre);
    });
    return Array.from(s).sort();
  }, [allArtists]);
  const [genre, setGenre] = useState('');

  useEffect(() => {
    setGenre((g) => (!g ? allGenres[0] : g));
  }, [allArtists]);

  const data = useMemo(() => {
    let all = allArtists;

    LayoutAnimation.configureNext(LayoutAnimation.create(150, 'easeOut', 'opacity'));

    if (allArtists?.length === 0 && !isEmpty) {
      return emptyList() as Artists;
    }
    if (all) {
      return assembleList(all, category, genre, favorites);
    }
    return [] as Artists;
  }, [allArtists, category, genre]);

  if (isEmpty) {
    return (
      <View>
        <Body>No artist yet, come back later</Body>
      </View>
    );
  }

  return (
    <>
      <View style={styles.top}>
        <SegmentedButtons<Category> buttons={segments} active={category} onChange={setCategory} />
        {category === 'Genres' && (
          <SegmentedButtons buttons={allGenres} active={genre} onChange={setGenre} />
        )}
      </View>
      {category === 'Faves' && data.length === 0 && <EmptyFaveList />}
      {data?.length > 0 && (
        <FlashList
          data={data}
          estimatedItemSize={ITEM_HEIGHT}
          refreshControl={<RefreshControl refreshing={isReloading} onRefresh={reload} />}
          renderItem={({ item }) => {
            if (typeof item === 'string') {
              return <SectionHeader title={item} />;
            }
            return item._id.includes('skeleton_') ? (
              <ArtistListItemSkeleton />
            ) : (
              <ArtistListItem artist={item} />
            );
          }}
          getItemType={(item) => (typeof item === 'string' ? 'sectionTitle' : 'row')}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  top: {
    backgroundColor: 'white',
    borderBottomColor: Colors.light.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default ArtistsList;
