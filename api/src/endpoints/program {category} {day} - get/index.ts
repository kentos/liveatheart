import { FastifyInstance, FastifyRequest } from '@heja/shared/fastify'
import { collection } from '@heja/shared/mongodb'
import _ from 'lodash'
import { Artist } from '../../features/artists/types'

async function getSampleArtists() {
  return collection<Artist>('artists')
    .aggregate<Artist>([{ $sample: { size: _.random(2, 11) } }])
    .toArray()
}

async function handleConcerts(day: string) {
  return [
    {
      time: '12:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '13:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '14:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '15:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '16:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '17:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '18:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '19:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '20:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '21:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '22:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '23:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '00:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
    {
      time: '01:00',
      slots: (await getSampleArtists()).map((a) => ({
        artist: a,
        venue: { name: 'Some venue' },
      })),
    },
  ]
}

async function handler(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/program/:category/:day',
    schema: {
      params: {
        type: 'object',
        required: ['category', 'day'],
        properties: {
          category: {
            type: 'string',
            enum: ['concerts', 'film', 'conference'],
          },
          day: {
            type: 'string',
            enum: ['wed', 'thu', 'fri', 'sat'],
          },
        },
      },
    },
    handler: async (
      req: FastifyRequest<{ Params: { category: string; day: string } }>,
    ) => {
      switch (req.params.category) {
        case 'concerts':
          return handleConcerts(req.params.day)
        case 'film':
          return []
        case 'conference':
          return []
        default:
      }
    },
  })
}

export default handler
