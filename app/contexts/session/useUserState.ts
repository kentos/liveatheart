import { create } from 'zustand';

interface UserState {
  isLoaded: boolean;
  _id?: string;
  firstName?: string;
  lastName?: string;
  restore: (arg0: { _id: string; firstName?: string; lastName?: string }) => void;
}

const useUserState = create<UserState>((set) => ({
  isLoaded: false,
  _id: undefined,
  firstName: undefined,
  lastName: undefined,

  restore: (props) => {
    set({ isLoaded: true, ...props });
  },
}));

export default useUserState;
