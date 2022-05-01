const mock = [
  {
    id: 'abc123',
    title: 'Artist registration for Live At Heart 2022 is now open',
    text: 'abc123',
    image: 'https://liveatheart.se/wp-content/uploads/Artist-reg02-1080x675.jpeg',
  },
  {
    id: 'def456',
    title: 'Martin Qvarfordt new CEO of Live at Heart',
    text: 'abc123',
    image: 'https://liveatheart.se/wp-content/uploads/MartinQ_crop1-1080x675.jpg',
  },
];

function useNews(id?: string): {
  allNews: News[];
  single?: News;
} {
  let single;
  if (id) {
    single = mock.find((m) => m.id === id);
  }
  return {
    allNews: mock,
    single,
  };
}

export default useNews;
