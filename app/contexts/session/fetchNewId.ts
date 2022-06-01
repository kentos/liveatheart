import { get } from '../../libs/api';

interface FetchNewId {
  _id: string;
}

async function fetchNewId() {
  const newid = await get<FetchNewId>('/users');
  return newid.data._id;
}

export default fetchNewId;
