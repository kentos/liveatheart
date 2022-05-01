import { StatusBar } from 'expo-status-bar';
import FeatureToggleProvider from './features/toggles/FeatureToggle';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <FeatureToggleProvider>
        <Navigation />
        <StatusBar />
      </FeatureToggleProvider>
    );
  }
}
