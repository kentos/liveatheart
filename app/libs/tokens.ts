import axios from 'axios';
import useUserState from '../contexts/session/useUserState';
import config from '../constants/config';

let renewal: Promise<string> | null;

const instance = axios.create({
  baseURL: config.api,
  timeout: 15000,
  validateStatus(status) {
    return status < 500;
  },
});

export async function renewAuthToken(refreshToken: string): Promise<string> {
  if (renewal) {
    return renewal;
  }
  renewal = (async () => {
    const result = await instance.post<{ authToken: string }>('/auth', { refreshToken });
    if (result.status === 403) {
      throw new Error('Dead token');
    }
    useUserState.getState().setAuthtoken(result.data.authToken);
    renewal = null;
    return result.data.authToken;
  })();
  return renewal;
}
