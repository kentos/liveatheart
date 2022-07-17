import schedule from 'node-schedule'
import { loadArtists } from '../loaders/artists'
import { loadDeals } from '../loaders/deals'
import { loadNews } from '../loaders/news'

function task(fn: () => Promise<void>) {
  return async (fireDate: Date) => {
    try {
      console.log('[task]', fn.name, fireDate)
      await fn()
    } catch (e: any) {
      console.log('[task error]:', e)
    }
  }
}

schedule.scheduleJob('fetch news', '*/5 * * * *', task(loadNews))
schedule.scheduleJob('fetch artists', '*/10 * * * *', task(loadArtists))
schedule.scheduleJob('fetch deals', '*/15 * * * *', task(loadDeals))

console.log(Object.keys(schedule.scheduledJobs))
