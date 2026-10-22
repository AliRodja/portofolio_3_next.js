import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById } from "@/db/queries/projects";
import { requireAdmin } from "@/lib/session";
import { ProjectForm } from "../../_components/project-form";
import { updateProject } from "../../actions";

export const metadata: Metadata = {
  title: "Edit project",
};

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
      <h1 className="mb-8 text-3xl font-bold">Edit project</h1>
      <ProjectForm action={updateProject.bind(null, project.id)} project={project} />
    </>
  );
}
