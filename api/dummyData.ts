import { faker } from '@faker-js/faker'
import { collection, connect } from '@heja/shared/mongodb'
import { ulid } from 'ulid'
import _ from 'lodash'
import 'dotenv/config'

const NUM_ARTISTS = 100
const genres = [
  'Blues',
  'Electronic',
  'Experimental',
  'Folk/Country',
  'Indie',
  'Jazz',
  'Metal/Hardcore',
  'Pop',
  'R&B',
  'Rap/Hip Hop',
  'Rock',
  'Soul/neo-soul',
]
const countries = [
  'Sweden',
  'Norway',
  'Finland',
  'United States (US)',
  'Canada',
  'Serbia',
  'Ireland',
  'Netherlands',
  'Austria',
  'Macedonia',
  'Slovenia',
]

const usedNames: string[] = []
const nameGenerators = [
  faker.animal.bear,
  faker.animal.fish,
  faker.animal.snake,
  faker.animal.cat,
  faker.animal.lion,
]

const getName = (): string => {
  const nameGenerator = nameGenerators[_.random(0, nameGenerators.length - 1)]
  const name = nameGenerator()
  if (usedNames.includes(name)) {
    return getName()
  }
  usedNames.push(name)
  return name
}

const getGenre = (): string => {
  return genres[_.random(0, genres.length - 1)]
}

const getCountry = (): string => {
  return countries[_.random(0, countries.length - 1)]
}

async function main() {
  console.log('connecting')
  await connect({
    url: 'mongodb://localhost:27018',
    database: 'lah23',
    connectTimeoutMS: 1000,
    socketTimeoutMS: 1000,
  })
  console.log('connected')
  await collection('artists').deleteMany({})
  for (let i = 0; NUM_ARTISTS > i; i++) {
    const id = ulid()
    const name = getName()
    const genre = getGenre()
    const country = getCountry()
    const image = `https://picsum.photos/seed/${id}/450/300`
    const description = faker.lorem.paragraphs(2)

    await collection<any>('artists').insertOne({
      externalid: id,
      name,
      categories: [{ name: genre, slug: genre, hidden: false }],
      image,
      description,
      countryCode: country.substring(0, 3).toUpperCase(),
      link: '',
      slots: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

main()
