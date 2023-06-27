// import { FastifyInstance } from '@heja/shared/fastify'
// import authenticatedEndpoint from '../../lib/authenticateEndpoint'
// import onlyAdmins from '../../lib/onlyAdmins'
// import { ObjectId, collection } from '@heja/shared/mongodb'
// import { Artist } from '../../features/artists/types'
// import { User } from '../../features/users/types'

// type HeartedArtist = { _id: ObjectId; count: number; artist: Artist }

// async function mostHeartedArtists() {
//   const result = await collection<User>('users')
//     .aggregate<HeartedArtist[]>([
//       { $match: { 'favorites.0': { $exists: true } } },
//       { $unwind: '$favorites' },
//       {
//         $group: { _id: { $toObjectId: '$favorites._id' }, count: { $sum: 1 } },
//       },
//       { $sort: { count: -1 } },
//       { $limit: 5 },
//       {
//         $lookup: {
//           from: 'artists',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'artist',
//         },
//       },
//       { $unwind: '$artist' },
//     ])
//     .toArray()
//   return result
// }

// async function handler(fastify: FastifyInstance) {
//   fastify.route({
//     method: 'GET',
//     url: '/heartbeat/artists',
//     preHandler: [authenticatedEndpoint, onlyAdmins],
//     handler: async () => {
//       const mostHearted = await mostHeartedArtists()
//       return mostHearted
//     },
//   })
// }

// export default handler
