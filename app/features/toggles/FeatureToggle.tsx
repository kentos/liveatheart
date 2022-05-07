import React, { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { get } from '../../libs/api';

interface FeatureToggle {
  artists: boolean;
  schedule: boolean;
  deals: boolean;
  news: boolean;
}

const defaultState = {
  artists: true,
  schedule: true,
  deals: true,
  news: true,
};

export const FeatureToggleContext = React.createContext<FeatureToggle>(defaultState);

interface FeatureToggleProviderProps {
  children: ReactNode;
}

function FeatureToggleProvider({ children }: FeatureToggleProviderProps) {
  const { data, status } = useQuery<FeatureToggle>({
    queryKey: '/features',
    queryFn: async ({ queryKey }) => {
      const result = await get<FeatureToggle>(queryKey);
      return result.data;
    },
  });
  return (
    <FeatureToggleContext.Provider value={data || defaultState}>
      {status === 'success' && children}
    </FeatureToggleContext.Provider>
  );
}

export default FeatureToggleProvider;
