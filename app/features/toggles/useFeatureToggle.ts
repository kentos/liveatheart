import { useContext } from 'react';
import { FeatureToggleContext } from './FeatureToggle';

function useFeatureToggle() {
  const ctx = useContext(FeatureToggleContext);
  return ctx;
}

export default useFeatureToggle;
