import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../_components/page-header";
import { ProjectForm } from "../_components/project-form";
import { createProject } from "../actions";

export const metadata: Metadata = {
  title: "New project",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        title="New project"
        back={{ href: "/admin/projects", label: "Projects" }}
      />
      <ProjectForm action={createProject} />
    </>
  );
}
