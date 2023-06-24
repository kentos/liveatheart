import path from 'path'
import { FastifyReply, createServer, startServer } from '@heja/shared/fastify'
import { connect } from '@heja/shared/mongodb'

// import './worker/worker'
import { NotAllowed } from '@heja/shared/errors'
import getenv from 'getenv'

async function start() {
  await connect({})

  const server = await createServer({
    name: 'lah-api',
    maxParamLength: 5000,
    routes: path.join(__dirname, 'endpoints'),
    plugins: path.join(__dirname, 'plugins'),
    disableRequestLogging:
      getenv.string('NODE_ENV', 'development') === 'production',
    async errorHandler(error, _req, reply: FastifyReply) {
      console.error(error)
      if (error instanceof NotAllowed) {
        return reply.code(error.statusCode).send({})
      }
      return reply.code(500).send({ message: 'Server Error' })
    },
  })

  await startServer({
    server,
    port: getenv.int('PORT', 8080),
  })
}

start()
