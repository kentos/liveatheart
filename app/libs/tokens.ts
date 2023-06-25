import useUserState from '../contexts/session/useUserState';
import { trcpVanilla } from './trpc';

let renewal: Promise<string> | null;

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
