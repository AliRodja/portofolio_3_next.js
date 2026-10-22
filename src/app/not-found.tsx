import Link from "next/link";
import { GlassBackdrop } from "@/components/layout/glass-backdrop";
import { Navbar } from "@/components/layout/navbar";
import { buttonClass } from "@/components/ui/button";
import { getProfile } from "@/db/queries/profile";

export default async function NotFound() {
  const profile = await getProfile();

  return (
    // Outside the (site) group, so it sets up the dark backdrop itself.
    <div data-tone="dark" className="text-white">
      <GlassBackdrop />
      <Navbar name={profile.name} />
      <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-10">
        <div className="text-center">
          <h2 className="text-lg font-normal tracking-[8px] text-white/60 uppercase">
            Page not found
          </h2>
          <h1 className="text-4xl font-medium text-white">404</h1>
        </div>
        <Link href="/" className={buttonClass("glassDark")}>
          Go Home
        </Link>
      </main>
    </div>
  );
}
