import { get, store, remove } from '../../helpers/storage';
import useUserState from './useUserState';
import { renewAuthToken } from '../../libs/tokens';
import setupNewAccount from './setupNewAccount';
import { getRefreshToken } from './getRefreshToken';

const KEY = 'REFRESH_TOKEN';

async function setupClient() {
  try {
    const refreshToken = await setupNewAccount();
    await store(KEY, refreshToken);
    await renewAuthToken(refreshToken);
  } catch (e) {
    console.log(e);
    remove(KEY);
  }
}

async function restoreUserSession() {
  const stored = await getRefreshToken();
  if (stored) {
    try {
      const authToken = await renewAuthToken(stored);
      useUserState.getState().restore({ authToken });
      return;
    } catch (e: any) {
      if (e.message === 'Dead token') {
        await setupClient();
      } else {
        alert(e.message);
        console.log(e);
      }
    }
  } else {
    await setupClient();
  }
}

export default restoreUserSession;
