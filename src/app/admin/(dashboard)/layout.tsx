import { Suspense } from "react";
import { getUploadMode } from "@/lib/uploads";
import { ActiveSidebar, SidebarFrame } from "./_components/sidebar";
import { UploadModeProvider } from "./_components/upload";
import { UserCard, UserCardSkeleton } from "./_components/user-card";

// Every dashboard page checks the session on each request, so navigating
// between them is allowed to wait for the server instead of being instant.
export const instant = false;

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
        <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-10 md:py-10">
          <UploadModeProvider mode={getUploadMode()}>{children}</UploadModeProvider>
        </div>
      </main>
    </div>
  );
}
