import { trpc } from '../libs/trpc';
import useUser from './useUser';

export default function useFeatures() {
  const user = useUser();
  const features = trpc.user.getFeatures.useQuery(
    { userId: user._id },
    {
      enabled: user._id !== undefined,
    }
  );
  return features.data;
}
