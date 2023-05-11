import { ReactNode, createContext, useEffect } from 'react';
import SplashLoading from '../../components/SplashLoading';
import useUserState from './useUserState';
import restoreUserSession from './restoreUserSession';
import ping from './ping';

interface SessionContext {
  userid?: string;
  authtoken?: string;
}

const SessionContext = createContext<SessionContext>({});

interface SessionContextProviderProps {
  children: ReactNode;
}

function SessionContextProvider({ children }: SessionContextProviderProps) {
  const isLoaded = useUserState((state) => state.isLoaded);
  const userid = useUserState((state) => state._id);

  useEffect(() => {
    restoreUserSession();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      ping();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <SplashLoading />;
  }

  return <SessionContext.Provider value={{ userid }}>{children}</SessionContext.Provider>;
}

export default SessionContextProvider;
