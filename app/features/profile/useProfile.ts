import { useQuery } from '@tanstack/react-query';
import { get } from '../../libs/api';

type Profile = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function useProfile() {
  const { data, isInitialLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const result = await get<Profile>('/profile');
      return result.data;
    },
  });

  const isIncompleteProfile = !isInitialLoading && !data?.firstName && !data?.lastName;

  return { data, isIncompleteProfile };
}
