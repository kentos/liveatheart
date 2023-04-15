import axios from 'axios'

async function parse() {
  const result = await axios.get(
    'https://liveatheart.se/wp-json/wp/v2/news?_embed=wp:featuredmedia&per_page=5',
  )
  console.dir(result.data, { depth: null })
}

parse()
