import fetchNewId from './fetchNewId';
import claimUserId from './claimUserId';
import { get, store, remove } from '../../helpers/storage';
import useUserState from './useUserState';

const KEY = '@LAH/USERID';

async function restoreUserSession() {
  const stored = await get(KEY);
  if (stored) {
    useUserState.getState().restore({ _id: stored });
    return;
  } else {
    try {
      const newid = await fetchNewId();
      await store(KEY, newid);
      await claimUserId(newid);
      useUserState.getState().restore({ _id: newid });
    } catch (e) {
      console.log(e);
      remove(KEY);
    }
  }
}

export default restoreUserSession;
