import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperienceById } from "@/db/queries/experience";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../../_components/page-header";
import { ExperienceForm } from "../../_components/experience-form";
import { updateExperience } from "../../actions";

export const metadata: Metadata = {
  title: "Edit experience",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function EditExperiencePage({
  params,
}: PageProps<"/admin/experience/[id]/edit">) {
  await requireAdmin();
  const id = Number((await params).id);
  const experience = Number.isInteger(id) ? await getExperienceById(id) : undefined;

  if (!experience) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={experience.role}
        description={`Edit experience at ${experience.company}`}
        back={{ href: "/admin/experience", label: "Experience" }}
      />
      <ExperienceForm
        action={updateExperience.bind(null, experience.id)}
        experience={experience}
      />
    </>
  );
}
