import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootSiblingParent } from 'react-native-root-siblings';
import { trpc, trpcClient } from './libs/trpc';
import SessionContextProvider from './contexts/session/Context';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import './libs/pushNotifications';

import { queryClient } from './libs/queryClient';

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  }
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider>
          <RootSiblingParent>
            <Navigation />
          </RootSiblingParent>
          <StatusBar />
        </SessionContextProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
