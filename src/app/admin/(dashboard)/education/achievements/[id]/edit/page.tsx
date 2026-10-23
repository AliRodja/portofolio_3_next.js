import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAchievementById } from "@/db/queries/education";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../../../_components/page-header";
import { AchievementForm } from "../../../_components/achievement-form";
import { updateAchievement } from "../../../actions";

export const metadata: Metadata = {
  title: "Edit achievement",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function EditAchievementPage({
  params,
}: PageProps<"/admin/education/achievements/[id]/edit">) {
  await requireAdmin();
  const id = Number((await params).id);
  const achievement = Number.isInteger(id) ? await getAchievementById(id) : undefined;

  if (!achievement) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={achievement.title}
        description={`Edit achievement at ${achievement.event}`}
        back={{ href: "/admin/education", label: "Education" }}
      />
      <AchievementForm
        action={updateAchievement.bind(null, achievement.id)}
        achievement={achievement}
      />
    </>
  );
}
