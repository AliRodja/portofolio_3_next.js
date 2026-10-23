import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../_components/page-header";
import { EducationForm } from "../_components/education-form";
import { createEducation } from "../actions";

export const metadata: Metadata = {
  title: "New education",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function NewEducationPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        title="New education"
        back={{ href: "/admin/education", label: "Education" }}
      />
      <EducationForm action={createEducation} />
    </>
  );
}
