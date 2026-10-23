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
          <h2 className="text-lg font-normal tracking-[8px] text-ink/60 uppercase">
            Page not found
          </h2>
          <h1 className="text-4xl font-medium text-ink">404</h1>
        </div>
        <Link href="/" className={buttonClass("glassSolid")}>
          Go Home
        </Link>
      </main>
    </div>
  );
}
