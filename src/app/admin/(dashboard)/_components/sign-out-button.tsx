"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut();
    router.push("/admin/login");
  };

  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-lg border border-gray-300 px-3 py-1.5 transition hover:bg-gray-100"
    >
      Sign out
    </button>
  );
}
