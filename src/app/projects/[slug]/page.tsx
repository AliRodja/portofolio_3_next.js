import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { TechList } from "@/components/tech-list";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="py-20 md:py-28">
      <Container>
        <Link
          href="/projects"
          className="text-sm text-muted transition hover:text-foreground"
        >
          ← Back to projects
        </Link>

        <header className="mt-8 mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            {project.year}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {project.summary}
          </p>
          <div className="mt-6">
            <TechList items={project.tech} />
          </div>
          {(project.previewUrl || project.sourceUrl) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.previewUrl && (
                <ButtonLink
                  href={project.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live preview
                </ButtonLink>
              )}
              {project.sourceUrl && (
                <ButtonLink
                  href={project.sourceUrl}
                  variant="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source code
                </ButtonLink>
              )}
            </div>
          )}
        </header>

        <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
          {project.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {project.images && project.images.length > 0 && (
          <div className="mt-16 space-y-6">
            {project.images.map((image, index) => (
              <Image
                key={image}
                src={image}
                alt={`${project.title} screenshot ${index + 1}`}
                width={1920}
                height={1080}
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="h-auto w-full rounded-2xl border border-border"
              />
            ))}
          </div>
        )}
      </Container>
    </article>
  );
}
