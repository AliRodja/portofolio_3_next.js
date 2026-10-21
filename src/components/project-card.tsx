import Image from "next/image";
import Link from "next/link";
import { TechList } from "@/components/tech-list";
import type { Project } from "@/data/projects";

function initials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-accent/25 to-accent/5">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-display text-5xl font-bold text-accent/60">
            {initials(project.title)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-sm text-muted">{project.year}</p>
        <h3 className="font-display text-xl font-semibold group-hover:text-accent">
          {project.title}
        </h3>
        <p className="flex-1 leading-relaxed text-muted">{project.summary}</p>
        <TechList items={project.tech} />
      </div>
    </Link>
  );
}
