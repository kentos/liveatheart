import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from 'react-query';
import FeatureToggleProvider from './features/toggles/FeatureToggle';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
// import * as Sentry from 'sentry-expo';

// Sentry.init({
//   dsn: 'https://b071a2fc4d714e0586a76958d9aec17a@o1247194.ingest.sentry.io/6407070',
//   enableInExpoDevelopment: false,
//   debug: true,
// });

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
