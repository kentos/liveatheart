import path from 'path'
import { createServer, startServer } from '@heja/shared/fastify'
import { loadDeals } from './loaders/deals'
import { loadNews } from './loaders/news'

async function start() {
  await Promise.all([loadDeals(), loadNews()])

  const server = await createServer({
    name: 'lah-api',
    routes: path.join(__dirname, 'endpoints'),
    plugins: path.join(__dirname, 'plugins'),
  })

  await startServer({
    server,
    port: 8080,
  })
}

start()
