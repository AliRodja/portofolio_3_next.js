import { GlassStage } from "@/components/glass/glass-stage";
import { Navbar } from "@/components/layout/navbar";
import { TabBar } from "@/components/layout/tab-bar";
import { getProfile } from "@/db/queries/profile";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();

  return (
    <div className="text-ink">
      <GlassStage />
      <Navbar name={profile.name} />
      <TabBar />
      {children}
    </div>
  );
}
