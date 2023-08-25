import getenv from 'getenv'
import schedule from 'node-schedule'
import { loadArtists } from '../loaders/artists'
import { loadDeals } from '../loaders/deals'
import { loadNews } from '../loaders/news'
import { connect } from '@heja/shared/mongodb'
import { loadVenues } from '../loaders/venues'
import { loadEvents } from '../loaders/events'

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

async function start() {
  await connect({})

  if (getenv('NODE_ENV', 'development') !== 'production') {
    // await loadArtists()
    // await loadVenues()
    // loadEvents()
    // loadNews()
    // loadDeals()
    return
  }
  schedule.scheduleJob('fetch news', '*/10 * * * *', task(loadNews))
  schedule.scheduleJob('fetch artists', '*/5 * * * *', task(loadArtists))
  schedule.scheduleJob('fetch venues', '*/10 * * * *', task(loadVenues))
  schedule.scheduleJob('fetch events', '*/2 * * * *', task(loadEvents))
  schedule.scheduleJob('fetch deals', '*/15 * * * *', task(loadDeals))

  console.log(Object.keys(schedule.scheduledJobs))
}

start()
