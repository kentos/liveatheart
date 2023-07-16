import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export default router({
  getSchedule: publicProcedure.query(async () => {
    return []
  }),

  getScheduleByDay: publicProcedure
    .input(
      z.object({
        category: z.string(),
        day: z.string(),
      }),
    )
    .query(async ({ input }) => {
      await new Promise((res) => setTimeout(res, 2000))
      const program = Array.from({ length: 20 }).map((_, i) => ({
        day: 'Wed',
        time: `${i + 12}:${i % 2 === 0 ? '00' : '30'}`,
        slots: Array.from({ length: 50 }).map((_, i) => ({
          artist: {
            name: `Artist ${i + 1}`,
            image:
              'https://liveatheart.se/wp-content/uploads/2023/04/Great-New-Mommy-Pic-3mb-1024x632.jpg',
          },
          venue: { name: `Venue ${i + 1}` },
        })),
      }))
      return {
        program,
        day: input.day,
        category: input.category,
      }
    }),
})
