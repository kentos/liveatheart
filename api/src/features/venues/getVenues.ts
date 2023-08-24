import { collection } from '@heja/shared/mongodb'
import { Venue } from '../artists/types'

export async function getVenues() {
  return collection<Venue>('venues')
    .find({ deletedAt: { $exists: false } })
    .toArray()
}
