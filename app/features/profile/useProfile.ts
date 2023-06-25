import { trpc } from '../../libs/trpc';

export default function useProfile() {
  const { data, isInitialLoading } = trpc.user.getProfile.useQuery();

  const isIncompleteProfile = !isInitialLoading && !data?.firstName && !data?.lastName;

  return { data, isIncompleteProfile };
}
