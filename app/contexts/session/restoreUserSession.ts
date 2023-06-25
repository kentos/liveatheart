import { get, store, remove } from '../../helpers/storage';
import useUserState from './useUserState';
import { renewAuthToken } from '../../libs/tokens';
import setupNewAccount from './setupNewAccount';
import { getRefreshToken } from './getRefreshToken';
import { TRPCClientError } from '@trpc/client';

const KEY = 'REFRESH_TOKEN';

export async function resetClient() {
  await remove(KEY);
  alert('Reload app');
}

async function setupClient() {
  try {
    const refreshToken = await setupNewAccount();
    await store(KEY, refreshToken);
    const authToken = await renewAuthToken(refreshToken);
    useUserState.getState().restore({ authToken });
    return authToken;
  } catch (e) {
    console.log(e);
    await remove(KEY);
  }
}

async function restoreUserSession() {
  const stored = await getRefreshToken();
  if (!stored) {
    await setupClient();
    return;
  }
  try {
    const authToken = await renewAuthToken(stored);
    useUserState.getState().restore({ authToken });
    return authToken;
  } catch (e: any) {
    if (e instanceof TRPCClientError) {
      if (e.data.path === 'auth.renewAuthToken') {
        await setupClient();
        return;
      }
    }
    alert(e.message);
    console.log(e);
  }
}

export default restoreUserSession;
