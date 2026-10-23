import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/layout/back-button";
import { PageTransition } from "@/components/motion/page-transition";
import { SectionTitle } from "@/components/sections/section-title";
import { getProjects } from "@/db/queries/projects";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every project I have built, in one list.",
};

const headerClass =
  "px-3 py-3 text-sm font-medium tracking-wider text-ink/60 uppercase";

export default async function ArchivePage() {
  const projects = await getProjects();

  return (
    <PageTransition>
      <main className="min-h-screen overflow-hidden pt-16">
        <BackButton href="/projects" />
        <SectionTitle title="Archive" />
        <div className="container mx-auto mb-10 px-6 md:px-10">
          <div className="glass overflow-x-auto rounded-2xl p-2 md:p-4">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className={headerClass}>Year</th>
                  <th className={headerClass}>Title</th>
                  <th className={headerClass}>Technology</th>
                  <th className={headerClass}>Link</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.slug}
                    className="border-t border-ink/10 transition duration-300 hover:bg-ink/5"
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
        </div>
      </main>
    </PageTransition>
  );
}
