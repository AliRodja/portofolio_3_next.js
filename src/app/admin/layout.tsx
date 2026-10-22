import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div data-admin className="min-h-dvh bg-gray-50 text-gray-900">
      {children}
    </div>
  );
}
