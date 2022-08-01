import { collection } from '@heja/shared/mongodb'

async function getAllDeals() {
  const deals = await collection<Deal>('deals')
    .find({ deletedAt: { $exists: false } })
    .toArray()
  return deals
}

export { getAllDeals }
