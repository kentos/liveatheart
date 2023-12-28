import { api } from "~/utils/api";

export default function useProfile() {
  const profile = api.user.getProfile.useQuery(undefined, {
    staleTime: Infinity,
  });

  return profile.data;
}
