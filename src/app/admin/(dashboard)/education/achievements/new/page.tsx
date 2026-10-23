import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../../_components/page-header";
import { AchievementForm } from "../../_components/achievement-form";
import { createAchievement } from "../../actions";

export const metadata: Metadata = {
  title: "New achievement",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function NewAchievementPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        title="New achievement"
        back={{ href: "/admin/education", label: "Education" }}
      />
      <AchievementForm action={createAchievement} />
    </>
  );
}
