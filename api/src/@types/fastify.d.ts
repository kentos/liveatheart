import type { FastifyRequest } from 'fastify'

declare module 'fastify' {
  export interface FastifyRequest<> {
    currentUser: { _id: string }
  }
}
