import { collection } from '@heja/shared/mongodb'
import { Deal } from './deals/types'

async function getAllDeals() {
  const deals = await collection<Deal>('deals')
    .find({ deletedAt: { $exists: false } }, { sort: { publishedAt: 1 } })
    .toArray()
  return deals
}

export { getAllDeals }
