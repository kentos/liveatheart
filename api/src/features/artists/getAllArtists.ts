import { collection } from '@heja/shared/mongodb'
import { Artist } from './types'

let localCache: Artist[] = []
const lastSet = Date.now()

export async function getAllArtists() {
  if (Date.now() - lastSet > 1000 * 60 * 2) {
    // 2 minutes in-memory cache
    return localCache
  }
  localCache = await collection<Artist>('artists')
    .find({ deletedAt: { $exists: false } })
    .toArray()
  return localCache
}
