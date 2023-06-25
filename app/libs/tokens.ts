import axios from 'axios';
import useUserState from '../contexts/session/useUserState';
import config from '../constants/config';
import { trcpVanilla, trpc } from './trpc';

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
    const result = await trcpVanilla.auth.renewAuthToken.mutate({ refreshToken });
    useUserState.getState().setAuthtoken(result.authToken);
    renewal = null;
    return result.authToken;
  })();
  return renewal;
}
