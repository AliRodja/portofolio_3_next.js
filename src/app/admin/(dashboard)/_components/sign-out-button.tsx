"use client";

import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      aria-label="Sign out"
      title="Sign out"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
    >
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </button>
  );
}
