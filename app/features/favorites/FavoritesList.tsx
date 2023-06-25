import _ from 'lodash';
import { useMemo } from 'react';
import { FlatList } from 'react-native';
import { useArtists } from '../artists/useArtists';
import ArtistListItem from '../artists/list/ArtistListItem';
import useFavorites from './useFavorites';

function FavoritesList() {
  const { favorites } = useFavorites();
  console.log('FAVORITES:', favorites);
  const { artists: data } = useArtists(favorites);
  const artists = useMemo(() => _.sortBy(data, (a) => a.name), [data]);

  return (
    <FlatList
      data={artists}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <ArtistListItem artist={item} />}
    />
  );
}

export default FavoritesList;
