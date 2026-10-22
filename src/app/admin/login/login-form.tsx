"use client";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  // Better Auth redirects back here with ?error=... when sign-in fails,
  // including when the GitHub email is not on the allowlist.
  const error = searchParams.get("error");

  const signIn = async () => {
    setIsPending(true);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/admin",
      errorCallbackURL: "/admin/login",
    });
  };

  return (
    <>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Sign-in failed. Only the site owner&apos;s GitHub account can access
          the dashboard.
        </p>
      )}
      <button
        type="button"
        onClick={signIn}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-700 disabled:opacity-60"
      >
        <FontAwesomeIcon icon={faGithub} className="text-xl" />
        {isPending ? "Redirecting..." : "Sign in with GitHub"}
      </button>
    </>
  );
}
