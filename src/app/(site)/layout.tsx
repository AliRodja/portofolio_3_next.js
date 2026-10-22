import { Navbar } from "@/components/layout/navbar";
import { getProfile } from "@/db/queries/profile";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();

  return (
    <>
      <Navbar name={profile.name} />
      {children}
    </>
  );
}
