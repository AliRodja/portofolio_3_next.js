import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { Sidebar } from "./_components/sidebar";
import { SignOutButton } from "./_components/sign-out-button";

// The shell prerenders statically. Only the user badge waits on the session,
// and every page checks the session again on its own.
export default function DashboardLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-end border-b border-gray-200 bg-white px-6">
          <Suspense>
            <AdminBadge />
          </Suspense>
        </header>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}

async function AdminBadge() {
  const admin = await requireAdmin();
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="hidden text-gray-500 sm:inline">{admin.email}</span>
      <SignOutButton />
    </div>
  );
}
