import type { Metadata } from "next";
import { getProfile } from "@/db/queries/profile";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../_components/page-header";
import { ProfileForm } from "./_components/profile-form";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  await requireAdmin();
  const profile = await getProfile();

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your details, photos, and links shown across the site."
      />
      <ProfileForm profile={profile} />
    </>
  );
}
