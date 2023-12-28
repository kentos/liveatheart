import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

export default function Logout() {
  const router = useRouter();
  const logout = api.auth.logout.useMutation({
    onSuccess: () => {
      void router.push("/");
    },
  });

  useEffect(() => {
    logout.mutate();
  }, []);

  return <h1>Goodbye!</h1>;
}
