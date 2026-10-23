import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEducationById } from "@/db/queries/education";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../../_components/page-header";
import { EducationForm } from "../../_components/education-form";
import { updateEducation } from "../../actions";

export const metadata: Metadata = {
  title: "Edit education",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function EditEducationPage({
  params,
}: PageProps<"/admin/education/[id]/edit">) {
  await requireAdmin();
  const id = Number((await params).id);
  const education = Number.isInteger(id) ? await getEducationById(id) : undefined;

  if (!education) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={education.school}
        description="Edit education"
        back={{ href: "/admin/education", label: "Education" }}
      />
      <EducationForm
        action={updateEducation.bind(null, education.id)}
        education={education}
      />
    </>
  );
}
