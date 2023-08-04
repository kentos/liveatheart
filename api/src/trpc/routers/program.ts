import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { getVenues } from '../../features/venues/getVenues'
import { getAllArtists } from '../../features/artists/getAllArtists'
import { random } from 'radash'

export default router({
  getScheduleByDay: publicProcedure
    .input(
      z.object({
        category: z.string(),
        day: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const artists = await getAllArtists()

      await new Promise((res) => setTimeout(res, 2000))

      const program = Array.from({ length: 15 }).map((_, i) => ({
        time: `${i + 12}:${i % 2 === 0 ? '00' : '30'}`,
        slots: Array.from({ length: 10 }).map((_, i) => {
          const artist = artists[random(0, artists.length - 1)]
          return {
            artist: {
              _id: artist._id,
              name: artist.name,
              categories: artist.categories?.map((c) => c.name).join(',') ?? '',
              image: artist.image,
            },
            venue: { name: `Venue ${i + 1}` },
          }
        }),
      }))

      return {
        program,
        day: input.day,
        category: input.category,
      }
    }),

  getVenues: publicProcedure.query(async () => {
    return getVenues()
  }),
})
