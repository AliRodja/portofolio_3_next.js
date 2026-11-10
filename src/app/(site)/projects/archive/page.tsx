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
  "px-4 py-3 text-xs font-semibold tracking-[0.15em] text-ink/70 uppercase";

export default async function ArchivePage() {
  const projects = await getProjects();

  return (
    <PageTransition>
      <main className="min-h-screen overflow-hidden pt-16">
        <BackButton href="/projects" />
        <SectionTitle title="Archive" />
        <div className="container mx-auto mb-10 px-6 md:px-10">
          {projects.length === 0 ? (
            <div className="surface-card rounded-2xl p-12 text-center">
              <p className="font-display text-xl font-semibold text-ink">
                No archived projects yet
              </p>
              <p className="mt-2 text-sm text-ink/70">
                Projects added from the dashboard will be listed in this archive.
              </p>
            </div>
          ) : (
            <div className="surface-card overflow-x-auto rounded-2xl p-2 md:p-4">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className={headerClass}>Year</th>
                    <th className={headerClass}>Title</th>
                    <th className={headerClass}>Technology</th>
                    <th className={headerClass}>Links</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.slug}
                      className="border-t border-ink/10 transition duration-200 hover:bg-ink/5"
                    >
                      <td className="px-4 py-3 font-mono text-sm text-ink/75">
                        {project.year}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="hover:underline"
                        >
                          {project.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-ink/75">
                        {project.tech.join(", ")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {project.sourceUrl && (
                            <a
                              href={project.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${project.title} source code`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink/75 transition hover:bg-ink/10 hover:text-ink"
                            >
                              <FontAwesomeIcon icon={faGithub} className="text-lg" />
                            </a>
                          )}
                          {project.previewUrl && (
                            <a
                              href={project.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${project.title} live preview`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink/75 transition hover:bg-ink/10 hover:text-ink"
                            >
                              <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                                className="text-lg"
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
          )}
        </div>
      </main>
    </PageTransition>
  );
}
