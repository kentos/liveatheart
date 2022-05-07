import React, { ReactNode, useEffect, useState } from 'react';

interface FeatureToggle {
  artists: boolean;
  schedule: boolean;
  deals: boolean;
}

const defaultState = {
  artists: true,
  schedule: true,
  deals: true,
};

export const FeatureToggleContext = React.createContext<FeatureToggle>(defaultState);

interface FeatureToggleProviderProps {
  children: ReactNode;
}

function FeatureToggleProvider({ children }: FeatureToggleProviderProps) {
  const [features, setFeatures] = useState<FeatureToggle>();
  useEffect(() => {
    setTimeout(() => {
      setFeatures({
        artists: false,
        schedule: false,
        deals: true,
      });
    }, 15);
  }, []);
  return (
    <FeatureToggleContext.Provider value={features ?? defaultState}>
      {features && children}
    </FeatureToggleContext.Provider>
  );
}

export default FeatureToggleProvider;
