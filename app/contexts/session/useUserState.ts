import { create } from 'zustand';
import base64 from 'react-native-base64';

function getDataFromAuthtoken(token: string) {
  const [, payload] = token.split('.');
  const decoded = JSON.parse(base64.decode(payload)) as { _id: string; isAdmin?: boolean };
  return decoded;
}

interface UserState {
  isLoaded: boolean;
  _id?: string;
  firstName?: string;
  lastName?: string;
  authToken?: string;
  role: 'narp' | 'admin';
  restore: (arg0: { authToken: string }) => void;
  setAuthtoken: (authToken: string) => void;
}

const useUserState = create<UserState>((set) => ({
  isLoaded: false,
  _id: undefined,
  firstName: undefined,
  lastName: undefined,
  role: 'narp',

  restore: ({ authToken }) => {
    const data = getDataFromAuthtoken(authToken);
    set({ isLoaded: true, _id: data._id, authToken, ...(data.isAdmin && { role: 'admin' }) });
  },
  setAuthtoken: (authToken) => {
    set({ authToken });
  },
}));

export default useUserState;
