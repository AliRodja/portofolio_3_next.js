import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BackButton } from "@/components/layout/back-button";
import { Reveal } from "@/components/motion/reveal";
import { getProject, getProjects } from "@/db/queries/projects";
import { ScrollToggle } from "../_components/scroll-toggle";

export async function generateStaticParams() {
  const projects = await getProjects();
  // Cache Components fails the build on an empty list, so fall back to a slug
  // that renders the 404 page until the first project is added.
  if (projects.length === 0) return [{ slug: "placeholder" }];
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-normal tracking-[8px] text-white/50 uppercase">
        {label}
      </h2>
      <div className="text-2xl font-normal text-white">{children}</div>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="relative mb-10 flex min-h-screen w-full flex-col items-center justify-center gap-4 p-10">
      <BackButton href="/projects" />
      <ScrollToggle />

      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto mt-10 grid w-full max-w-6xl grid-cols-1 gap-10 md:mt-0 md:grid-cols-2">
          <Reveal className="mx-auto flex flex-col justify-center space-y-10">
            <div>
              <h2 className="text-lg font-normal tracking-[8px] text-white/50 uppercase">
                Project
              </h2>
              <h1 className="text-4xl font-medium text-white">
                {project.title}
              </h1>
            </div>
            <Detail label="Technology">{project.tech.join(", ")}</Detail>
            <Detail label="Year">{project.year}</Detail>
            {project.previewUrl && (
              <Detail label="Preview">
                <a
                  href={project.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Preview
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="ml-3"
                  />
                </a>
              </Detail>
            )}
            {project.sourceUrl && (
              <Detail label="Source Code">
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  GitHub
                  <FontAwesomeIcon icon={faGithub} className="ml-3" />
                </a>
              </Detail>
            )}
          </Reveal>

          <Reveal from="right" delay={0.2} className="flex flex-col justify-center">
            <h2 className="text-lg font-normal tracking-[8px] text-white/50 uppercase">
              Description
            </h2>
            {project.description.map((paragraph) => (
              <p
                key={paragraph}
                className="mb-5 text-justify text-xl tracking-wide text-white/70"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </div>

      {project.images.length > 0 && (
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 p-5 md:p-20">
          {project.images.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={`${project.title} screenshot ${index + 1}`}
              width={1920}
              height={1080}
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="h-auto w-full"
            />
          ))}
        </div>
      )}
    </main>
  );
}
