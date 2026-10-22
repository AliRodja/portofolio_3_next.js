import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../_components/page-header";
import { ExperienceForm } from "../_components/experience-form";
import { createExperience } from "../actions";

export const metadata: Metadata = {
  title: "New experience",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function NewExperiencePage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        title="New experience"
        back={{ href: "/admin/experience", label: "Experience" }}
      />
      <ExperienceForm action={createExperience} />
    </>
  );
}
