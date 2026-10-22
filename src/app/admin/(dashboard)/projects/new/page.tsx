import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { ProjectForm } from "../_components/project-form";
import { createProject } from "../actions";

export const metadata: Metadata = {
  title: "New project",
};

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">New project</h1>
      <ProjectForm action={createProject} />
    </>
  );
}
