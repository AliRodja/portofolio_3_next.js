import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/layout/back-button";
import { SectionTitle } from "@/components/sections/section-title";
import { getProjects } from "@/db/queries/projects";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every project I have built, in one list.",
};

export default async function ArchivePage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen overflow-hidden pt-16">
      <BackButton href="/projects" />
      <SectionTitle title="Archive" />
      <div className="container mx-auto mb-10 overflow-x-auto px-10">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-3 py-2">Year</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Technology</th>
              <th className="px-3 py-2">Link</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.slug}
                className="transition duration-500 hover:shadow-md"
              >
                <td className="px-3 py-2">{project.year}</td>
                <td className="px-3 py-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:underline"
                  >
                    {project.title}
                  </Link>
                </td>
                <td className="px-3 py-2">{project.tech.join(", ")}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-3">
                    {project.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} source code`}
                      >
                        <FontAwesomeIcon icon={faGithub} className="text-xl" />
                      </a>
                    )}
                    {project.previewUrl && (
                      <a
                        href={project.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live preview`}
                      >
                        <FontAwesomeIcon
                          icon={faArrowUpRightFromSquare}
                          className="text-xl"
                        />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
