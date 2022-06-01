import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

const customFonts = {
  'Archia-Bold': require('../assets/fonts/Archia-Bold.otf'),
  'Archia-Light': require('../assets/fonts/Archia-Light.otf'),
  'Archia-Medium': require('../assets/fonts/Archia-Medium.otf'),
  'Archia-Regular': require('../assets/fonts/Archia-Regular.otf'),
  'Archia-SemiBold': require('../assets/fonts/Archia-SemiBold.otf'),
  'Archia-Thin': require('../assets/fonts/Archia-Thin.otf'),
};

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          ...customFonts,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
