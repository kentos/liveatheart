import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from 'react-query';
import FeatureToggleProvider from './features/toggles/FeatureToggle';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

const queryClient = new QueryClient();

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <FeatureToggleProvider>
          <Navigation />
          <StatusBar />
        </FeatureToggleProvider>
      </QueryClientProvider>
    );
  }
}
