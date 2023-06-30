import { z } from 'zod'
import { getAllArtists } from '../../features/artists/getAllArtists'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import { removeHeart, setHeart } from '../../features/artists/hearts'
import { toObjectId } from '@heja/shared/mongodb'

function cleanCategories(a: { categories?: { name: string; slug: string }[] }) {
  return (
    a.categories
      ?.filter((c) => ![c.name, c.slug].includes('artists-2022'))
      .map((c) => c.name.replace('-', ' '))
      .join(', ') ?? 'Unknown'
  )
}

export default router({
  getAllArtists: publicProcedure.query(async () => {
    const result = await getAllArtists()
    return result.map((a) => ({
      _id: a._id.toString(),
      name: a.name,
      countryCode: a.countryCode || '',
      link: a.link,
      image: a.image,
      description: a.description,
      spotify: a.spotify,
      youtube: a.youtube,
      slots: [],
      genre: cleanCategories(a),
    }))
  }),

  setHeart: protectedProcedure
    .input(z.object({ artistId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return setHeart(toObjectId(input.artistId), ctx.requester)
    }),

  removeHeart: protectedProcedure
    .input(z.object({ artistId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return removeHeart(toObjectId(input.artistId), ctx.requester)
    }),
})
