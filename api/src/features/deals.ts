import { collection } from '@heja/shared/mongodb'

async function getAllDeals() {
  const deals = await collection<Deal>('deals')
    .find({ deletedAt: { $exists: false } }, { sort: { publishedAt: 1 } })
    .toArray()
  return deals
}

export { getAllDeals }
