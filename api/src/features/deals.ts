import { ulid } from 'ulid';

function getAllDeals() {
  return require('../data/deals.json');
}

export {
  getAllDeals,
}