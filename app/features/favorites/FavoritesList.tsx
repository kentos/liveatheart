import _ from 'lodash';
import { useMemo } from 'react';
import { FlatList } from 'react-native';
import { useArtistsData } from '../artists/hooks';
import ArtistListItem from '../artists/list/ArtistListItem';
import useFavorites from './useFavorites';

function FavoritesList() {
  const favs = useFavorites((state) => state.favoriteIds);
  const data = useArtistsData(favs);
  const artists = useMemo(() => _.sortBy(data, (a) => a.name), [data]);

  return (
    <FlatList
      data={artists}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ArtistListItem artist={item} />}
    />
  );
}

export default FavoritesList;
