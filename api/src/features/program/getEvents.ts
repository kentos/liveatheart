import { ObjectId, collection } from '@heja/shared/mongodb'
import { Artist, LAHEvent } from '../artists/types'
import _ from 'lodash'

export async function getEvents(from: Date, to: Date, venueId?: ObjectId) {
  const artists = await collection<Artist>('artists')
    .find({
      deletedAt: { $exists: false },
    })
    .toArray()

  const events = await collection<LAHEvent>('events')
    .find({
      artistid: { $exists: true },
      ...(venueId && { 'venue._id': venueId }),
      eventAt: { $gt: from, $lt: to },
      deletedAt: { $exists: false },
    })
    .toArray()
  return _(events)
    .map((e) => {
      const a = artists.find((a) => a._id.equals(e.artistid))
      if (!a) {
        return undefined
      }
      return {
        ...e,
        artist: {
          _id: a._id,
          name: a.name,
          image: a.image,
          categories: a.categories?.map((c) => c.name).join(', ') ?? '',
        },
      }
    })
    .compact()
    .value()
}
