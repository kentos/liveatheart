import { useState, useMemo } from 'react';
import { SectionList, LayoutAnimation, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import _ from 'lodash';
import ArtistListItem, { ITEM_HEIGHT } from './ArtistListItem';
import { useArtists } from '../useArtists';
import useFavorites from '../../favorites/useFavorites';
import SectionHeader from './SectionHeader';

const selectedEnum = {
  NAME: 0,
  GENRE: 1,
  FAVES: 2,
};

function ArtistsList() {
  const [selected, setSelected] = useState(0);
  const favorites = useFavorites((state) => state.favoriteIds);
  const { artists: allArtists } = useArtists();

  const data = useMemo(() => {
    let all = allArtists;
    LayoutAnimation.configureNext(LayoutAnimation.create(150, 'easeOut', 'opacity'));
    if (selected === selectedEnum.GENRE) {
      return _(all)
        .sortBy((a) => a.name)
        .groupBy((a) => a.genre)
        .map((val, key) => ({
          title: key,
          data: val,
        }))
        .sortBy((s) => s.title)
        .value();
    }
    if (selected === selectedEnum.FAVES) {
      all = all?.filter((a) => favorites.includes(a._id));
    }
    return [{ title: 'All', data: _.sortBy(all, (a) => a.name) }];
  }, [allArtists, selected]);

  return (
    <>
      <View style={{ backgroundColor: 'white', padding: 8 }}>
        <SegmentedControl
          values={['A-Ö', 'Genre', 'Faves']}
          selectedIndex={selected}
          onChange={(e) => setSelected(() => e.nativeEvent.selectedSegmentIndex)}
        />
      </View>
      <SectionList
        keyExtractor={(i) => i._id}
        sections={data}
        renderItem={({ item }) => <ArtistListItem artist={item} />}
        getItemLayout={(_data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        renderSectionHeader={(info) => {
          if (info.section.title === 'All') {
            return null;
          }
          return <SectionHeader title={info.section.title} />;
        }}
      />
    </>
  );
}

export default ArtistsList;
