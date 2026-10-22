import { GlassStage } from "@/components/glass/glass-stage";
import { Navbar } from "@/components/layout/navbar";
import { getProfile } from "@/db/queries/profile";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();

  // data-tone="dark" switches shared pieces like the navbar to light text.
  return (
    <div data-tone="dark" className="text-white">
      <GlassStage />
      <Navbar name={profile.name} />
      {children}
    </div>
  );
}
