import { useRouter } from "next/router";
import { useRef, type FormEvent } from "react";
import { api } from "~/utils/api";

export default function Login() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const login = api.auth.login.useMutation({
    onSuccess: () => {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");
      if (redirect) {
        void router.push(redirect);
      } else {
        void router.push("/admin");
      }
    },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (emailRef.current?.value && passwordRef.current?.value) {
      window.localStorage.setItem("last_used_email", emailRef.current.value);
      void login.mutateAsync({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
    }
    return;
  };

  const disabled = login.isLoading;

  return (
    <div className="m-auto mt-4 flex w-2/3 flex-col gap-4">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-2">
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            disabled={disabled}
            defaultValue="kent@kentcederstrom.se"
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            disabled={disabled}
          />
          <button type="submit" disabled={disabled}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
