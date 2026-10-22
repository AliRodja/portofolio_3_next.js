import { Suspense } from "react";
import { ActiveSidebar, SidebarFrame } from "./_components/sidebar";
import { UserCard, UserCardSkeleton } from "./_components/user-card";

// The shell prerenders statically. The active link and the user card stream
// in, and every page checks the session again on its own.
export default function DashboardLayout({ children }: LayoutProps<"/admin">) {
  const user = (
    <Suspense fallback={<UserCardSkeleton />}>
      <UserCard />
    </Suspense>
  );

  return (
    <div className="min-h-dvh bg-gray-50 md:flex">
      <Suspense fallback={<SidebarFrame user={user} />}>
        <ActiveSidebar user={user} />
      </Suspense>
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 md:px-10 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
