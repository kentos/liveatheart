import { useState, ReactNode, createContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchNewId from './fetchNewId';
import claimUserId from './claimUserId';

const KEY = '@LAH/USERID';

interface SessionContext {
  userid?: string;
}

const SessionContext = createContext<SessionContext>({
  userid: undefined,
});

interface SessionContextProviderProps {
  children: ReactNode;
}

function SessionContextProvider({ children }: SessionContextProviderProps) {
  const [userid, setUserid] = useState<string>();

  useEffect(() => {
    async function load() {
      const storedId = await AsyncStorage.getItem(KEY);
      if (storedId) {
        setUserid(() => storedId);
      } else {
        try {
          const newid = await fetchNewId();
          await AsyncStorage.setItem(KEY, newid);
          await claimUserId(newid);
          setUserid(() => newid);
        } catch (e) {
          console.log(e);
          AsyncStorage.removeItem(KEY);
        }
      }
    }
    load();
  }, []);

  return <SessionContext.Provider value={{ userid }}>{children}</SessionContext.Provider>;
}

export default SessionContextProvider;
