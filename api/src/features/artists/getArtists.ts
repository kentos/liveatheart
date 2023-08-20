import { ObjectId, collection } from '@heja/shared/mongodb'
import { Artist } from './types'
import _ from 'lodash'

export async function getArtistsByIds(artistIds: ObjectId[]) {
  const artist = await collection<Artist>('artists')
    .find({ _id: { $in: artistIds } })
    .toArray()
  return _.keyBy(artist, '_id')
}
