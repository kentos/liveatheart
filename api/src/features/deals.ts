import { collection } from '@heja/shared/mongodb'

async function getAllDeals() {
  const deals = await collection<Deal>('deals').find({}).toArray()
  return deals
}

export { getAllDeals }
