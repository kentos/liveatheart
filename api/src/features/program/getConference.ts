import { ObjectId, collection } from '@heja/shared/mongodb'
import { Conference } from '../types'

export async function getConference(from: Date, to: Date, venueId?: ObjectId) {
  const events = await collection<Conference>('conferences')
    .find({
      ...(venueId && { 'venue._id': venueId }),
      eventAt: { $gt: from, $lt: to },
      deletedAt: { $exists: false },
    })
    .toArray()
  return events.map((e) => ({
    ...e,
    artist: {
      name: e.name,
      image:
        'https://liveatheart.se/wp-content/uploads/2023/04/LAH-logo-WHITE.png',
      categories: ['Conference'],
    },
  }))
}
