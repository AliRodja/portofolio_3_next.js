import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/db/queries/projects";
import { projectCategories } from "@/lib/project-categories";
import { requireAdmin } from "@/lib/session";
import { DeleteProjectButton } from "./_components/delete-project-button";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getProjects();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-500">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-700"
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
          No projects yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Year</th>
                <th className="px-6 py-3 font-medium">Categories</th>
                <th className="px-6 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4">
                    <span className="font-medium">{project.title}</span>
                    {project.highlight && (
                      <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                        Highlight
                      </span>
                    )}
                    <span className="block text-gray-400">/{project.slug}</span>
                  </td>
                  <td className="px-6 py-4">{project.year}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {project.categories
                      .map((category) => projectCategories[category])
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="text-gray-500 hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProjectButton id={project.id} title={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
