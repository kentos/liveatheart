import getenv from 'getenv'
import schedule from 'node-schedule'
import { loadArtists } from '../loaders/artists'
import { loadDeals } from '../loaders/deals'
// import { loadEvents } from '../loaders/events'
// import { loadFilms } from '../loaders/films'
import { loadNews } from '../loaders/news'
// import { loadSeminars } from '../loaders/seminars'
// import { loadSpeakers } from '../loaders/speakers'
import { connect } from '@heja/shared/mongodb'

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
  // loadNews()
  // loadArtists()
  // loadDeals()
  // return
  if (getenv('NODE_ENV', 'development') === 'production') {
    schedule.scheduleJob('fetch news', '*/10 * * * *', task(loadNews))
    schedule.scheduleJob('fetch artists', '*/2 * * * *', task(loadArtists))
    //schedule.scheduleJob('fetch artists', '*/3 * * * *', task(loadEvents))
    schedule.scheduleJob('fetch deals', '*/10 * * * *', task(loadDeals))
    //schedule.scheduleJob('fetch speakers', '*/12 * * * *', task(loadSpeakers))
    //schedule.scheduleJob('fetch films', '*/4 * * * *', task(loadFilms))
    //schedule.scheduleJob('fetch films', '*/5 * * * *', task(loadSeminars))
  }

  console.log(Object.keys(schedule.scheduledJobs))
}

start()
