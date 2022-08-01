import { ObjectId } from '@heja/shared/mongodb'
import axios from 'axios'

export interface WPAPIResponse {
  id: number
  date: string
  status: string
  title: { rendered: string }
  featured_media: number
  project_category: number[]
  acf: {
    bio: string
    youtube: string
    spotify: string
    socials?: any
    artist_events?: any
  }
  _embedded: {
    'wp:featuredmedia': any
    'wp:term': any
  }
}

type HttpStatus = number
type LoaderTuple = [HttpStatus, WPAPIResponse[]]

async function loadUrl(url: string): Promise<LoaderTuple> {
  console.log('fetching:', url)
  const json = await axios.get<WPAPIResponse[]>(url)
  return [json.status, json.data]
}

async function loader(
  url: string,
  callback: (result: WPAPIResponse[]) => Promise<ObjectId[] | void>,
) {
  let page = 1
  let status = 200
  let storedIds: ObjectId[] = []

  while (status < 300) {
    try {
      const [thisStatus, thisResult] = await loadUrl(
        url.replace('{{page}}', String(page)),
      )
      status = thisStatus
      if (status < 300) {
        const result = await callback(thisResult)
        page += 1
        if (result) {
          storedIds = [...storedIds, ...result]
        }
      }
    } catch (e: any) {
      if (e.code === 'ERR_BAD_REQUEST') {
        status = 400
      } else {
        console.log(e)
      }
    }
  }

  return storedIds
}

export { loader }
