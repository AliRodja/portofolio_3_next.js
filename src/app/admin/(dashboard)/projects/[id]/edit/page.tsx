import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById } from "@/db/queries/projects";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "../../../_components/page-header";
import { ProjectForm } from "../../_components/project-form";
import { updateProject } from "../../actions";

export const metadata: Metadata = {
  title: "Edit project",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]/edit">) {
  await requireAdmin();
  const id = Number((await params).id);
  const project = Number.isInteger(id) ? await getProjectById(id) : undefined;

  if (!project) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={project.title}
        description="Edit project"
        back={{ href: "/admin/projects", label: "Projects" }}
      />
      <ProjectForm action={updateProject.bind(null, project.id)} project={project} />
    </>
  );
}
