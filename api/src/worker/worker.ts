import getenv from 'getenv'
import schedule from 'node-schedule'
import { loadArtists } from '../loaders/artists'
import { loadDeals } from '../loaders/deals'
import { loadEvents } from '../loaders/events'
import { loadNews } from '../loaders/news'
import { loadSpeakers } from '../loaders/speakers'

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

if (getenv('NODE_ENV', 'development') === 'production') {
  schedule.scheduleJob('fetch news', '*/10 * * * *', task(loadNews))
  schedule.scheduleJob('fetch artists', '*/5 * * * *', task(loadArtists))
  schedule.scheduleJob('fetch artists', '*/2 * * * *', task(loadEvents))
  schedule.scheduleJob('fetch deals', '5 * * * *', task(loadDeals))
  schedule.scheduleJob('fetch speakers', '0 * * * *', task(loadSpeakers))
}

console.log(Object.keys(schedule.scheduledJobs))
