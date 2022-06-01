import schedule from 'node-schedule'
import { loadNews } from '../loaders/news'

schedule.scheduleJob('dummy', '*/15 * * * *', async function dummy() {
  console.log(new Date(), 'DUMMY running')
})

schedule.scheduleJob('fetch news', '*/5 * * * *', loadNews)

console.log(Object.keys(schedule.scheduledJobs))
