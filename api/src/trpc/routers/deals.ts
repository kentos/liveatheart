import { getAllDeals } from '../../features/deals'
import { publicProcedure, router } from '../trpc'

export default router({
  getDeals: publicProcedure.query(async () => {
    return getAllDeals()
  }),
})
