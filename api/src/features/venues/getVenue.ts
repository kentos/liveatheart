import { ObjectId, collection } from '@heja/shared/mongodb'
import { Venue } from '../artists/types'

export async function getVenue(venueId: ObjectId) {
  return collection<Venue>('venues').findOne({ _id: venueId })
}
