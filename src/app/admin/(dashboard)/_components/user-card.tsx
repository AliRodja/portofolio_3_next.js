import Image from "next/image";
import { requireAdmin } from "@/lib/session";
import { SignOutButton } from "./sign-out-button";

export async function UserCard() {
  const admin = await requireAdmin();

  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2">
      {admin.image ? (
        <Image
          src={admin.image}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 rounded-full"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
          {admin.name.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{admin.name}</p>
        <p className="truncate text-xs text-gray-500">{admin.email}</p>
      </div>
      <SignOutButton />
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <span className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
      <span className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
    </div>
  );
}
