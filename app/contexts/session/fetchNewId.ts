import { get } from '../../libs/api';

async function fetchNewId() {
  const newid = await get<{ _id: string }>('/users');
  return newid.data._id;
}

export default fetchNewId;
