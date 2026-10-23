import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../_components/page-header";
import { SkillCategoryForm } from "../_components/skill-category-form";
import { createSkillCategory } from "../actions";

export const metadata: Metadata = {
  title: "New skill category",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function NewSkillCategoryPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        title="New skill category"
        description="Added at the end of the list."
        back={{ href: "/admin/skills", label: "Skills" }}
      />
      <SkillCategoryForm action={createSkillCategory} />
    </>
  );
}
