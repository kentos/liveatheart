import useUserState from '../contexts/session/useUserState';

export default function useUser() {
  const state = useUserState();
  return state;
}
