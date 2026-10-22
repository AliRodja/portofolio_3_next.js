import { faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/db/queries/projects";
import { projectCategories } from "@/lib/project-categories";
import { requireAdmin } from "@/lib/session";
import { primaryButtonClass } from "../_components/form";
import { PageHeader } from "../_components/page-header";
import { DeleteProjectButton } from "./_components/delete-project-button";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        title="Projects"
        description={`${projects.length} ${projects.length === 1 ? "project" : "projects"}, newest first.`}
        actions={
          <Link href="/admin/projects/new" className={primaryButtonClass}>
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            New project
          </Link>
        }
      />

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="font-medium">No projects yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Add your first project to show it on the site.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center md:px-6"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {project.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element -- small preview of arbitrary URLs
                    <img
                      src={project.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium">
                    <span className="truncate">{project.title}</span>
                    {project.highlight && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                        <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                        Highlight
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {project.year} ·{" "}
                    {project.categories
                      .map((category) => projectCategories[category])
                      .join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm sm:justify-end">
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  className="text-gray-500 hover:text-gray-900"
                >
                  View
                </Link>
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="font-medium hover:underline"
                >
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
