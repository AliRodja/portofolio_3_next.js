import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkillCategoryById } from "@/db/queries/skills";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../../_components/page-header";
import { SkillCategoryForm } from "../../_components/skill-category-form";
import { updateSkillCategory } from "../../actions";

export const metadata: Metadata = {
  title: "Edit skill category",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function EditSkillCategoryPage({
  params,
}: PageProps<"/admin/skills/[id]/edit">) {
  await requireAdmin();
  const id = Number((await params).id);
  const category = Number.isInteger(id) ? await getSkillCategoryById(id) : undefined;

  if (!category) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={category.title}
        description="Edit skill category"
        back={{ href: "/admin/skills", label: "Skills" }}
      />
      <SkillCategoryForm
        action={updateSkillCategory.bind(null, category.id)}
        category={category}
      />
    </>
  );
}
