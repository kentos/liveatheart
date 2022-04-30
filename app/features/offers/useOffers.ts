const data: Offer[] = require('./mockdata.json');

function useOffers(id?: string): { offers: Offer[] } {
  let offers = data;
  if (id) {
    offers = data.filter((d) => d.id === id);
  }
  return {
    offers,
  };
}

export default useOffers;
