import { collection } from '@heja/shared/mongodb'
import { Artist } from './types'

export async function getAllArtists() {
  return collection<Artist>('artists')
    .find({ deletedAt: { $exists: false } })
    .toArray()
}
