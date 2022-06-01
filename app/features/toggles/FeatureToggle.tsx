import React, { ReactNode } from 'react';
import { useQuery } from 'react-query';
import SplashLoading from '../../components/SplashLoading';
import { get } from '../../libs/api';

const defaultState = {
  artists: true,
  myArtists: false,
  map: false,
  schedule: true,
  deals: true,
  news: true,
};

type FeatureToggle = typeof defaultState;
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
    retry: true,
    retryDelay: 3000,
  });
  return (
    <FeatureToggleContext.Provider value={data || defaultState}>
      {status === 'success' ? children : <SplashLoading />}
    </FeatureToggleContext.Provider>
  );
}

export default FeatureToggleProvider;
