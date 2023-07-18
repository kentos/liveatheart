import { RouterOutput, trpc } from '../libs/trpc';
import useUser from './useUser';

type FeaturesHook = RouterOutput['user']['getFeatures'];

export default function useFeatures(): FeaturesHook {
  const user = useUser();
  const features = trpc.user.getFeatures.useQuery(undefined, {
    enabled: user._id !== undefined,
  });
  return features.data ?? {};
}
