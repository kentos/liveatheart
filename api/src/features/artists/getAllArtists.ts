import { collection } from '@heja/shared/mongodb'
import { Artist } from './types'

let localCache: Artist[] = []
const lastSet = Date.now()

export async function getAllArtists() {
  if (lastSet - Date.now() < 1000 * 60 * 2) {
    // 2 minutes
    localCache = await collection<Artist>('artists')
      .find({ deletedAt: { $exists: false } })
      .toArray()
  }
  return localCache
}
