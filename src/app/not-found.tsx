import Link from "next/link";
import { GlassStage } from "@/components/glass/glass-stage";
import { Navbar } from "@/components/layout/navbar";
import { TabBar } from "@/components/layout/tab-bar";
import { buttonClass } from "@/components/ui/button";
import { getProfile } from "@/db/queries/profile";

export default async function NotFound() {
  const profile = await getProfile();

  return (
    // Outside the (site) group, so it sets up the backdrop itself.
    <div className="text-ink">
      <GlassStage />
      <Navbar name={profile.name} />
      <TabBar />
      <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-10">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-ink/70 uppercase">
            Page not found
          </p>
          <h1 className="mt-2 text-5xl font-bold text-ink">404</h1>
        </div>
        <Link href="/" className={buttonClass("glassSolid")}>
          Return to Home
        </Link>
      </main>
    </div>
  );
}
