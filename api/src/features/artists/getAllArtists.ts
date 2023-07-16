import { collection } from '@heja/shared/mongodb'
import { Artist } from './types'

let localCache: Artist[] = []
let lastSet = Date.now()

export async function getAllArtists() {
  if (localCache.length > 0 && Date.now() - lastSet < 1000 * 60 * 2) {
    // 2 minutes in-memory cache
    return localCache
  }
  lastSet = Date.now()
  localCache = await collection<Artist>('artists')
    .find({ image: { $ne: undefined }, deletedAt: { $exists: false } })
    .toArray()
  return localCache
}
