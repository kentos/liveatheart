import { ulid } from 'ulid';

const allDeals = require('../data/deals.json')

function getAllDeals() {
  return allDeals;
}

export {
  getAllDeals,
}