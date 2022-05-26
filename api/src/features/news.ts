async function getAllNews() {
  return require('../data/news.json')
}

export { getAllNews }
