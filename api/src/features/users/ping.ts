import { WithoutId, collection } from '@heja/shared/mongodb'
import { UserSession } from './types'

type Ping = {
  user: string
  os: string
  osVersion: string
  timestamp: Date
}

export async function ping(data: Ping) {
  await collection<WithoutId<UserSession>>('usersessions').insertOne({
    user: data.user,
    os: data.os,
    osVersion: data.osVersion,
    timestamp: data.timestamp,
    createdAt: new Date(),
  })
}
