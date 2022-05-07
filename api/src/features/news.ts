const mock = require('../data/news.json')

async function getAllNews() {
  return mock
}

export { getAllNews };