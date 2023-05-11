import { get } from '../../helpers/storage';

const KEY = 'REFRESH_TOKEN';

export async function getRefreshToken() {
  return get(KEY);
}
