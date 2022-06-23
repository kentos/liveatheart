import schedule from 'node-schedule'
import { loadArtists } from '../loaders/artists'
import { loadNews } from '../loaders/news'

schedule.scheduleJob('fetch news', '*/5 * * * *', loadNews)
schedule.scheduleJob('fetch artists', '*/10 * * * *', loadArtists)

console.log(Object.keys(schedule.scheduledJobs))
