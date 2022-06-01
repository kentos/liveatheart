import path from 'path'
import { createServer, startServer } from '@heja/shared/fastify'
import { loadDeals } from './loaders/deals'
import { loadArtists } from './loaders/artists'
import { connect } from '@heja/shared/mongodb'

import './worker/worker'

async function start() {
  await connect({})
  // await Promise.all([loadArtists(), loadDeals()])

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
