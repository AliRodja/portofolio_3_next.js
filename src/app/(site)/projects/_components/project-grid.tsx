"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/db/schema";
import {
  projectCategories,
  type ProjectCategory,
} from "@/lib/project-categories";

type Filter = ProjectCategory | "all";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduceMotion = useReducedMotion();

  const usedCategories = (
    Object.keys(projectCategories) as ProjectCategory[]
  ).filter((category) =>
    projects.some((project) => project.categories.includes(category)),
  );
  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    ...usedCategories.map((category) => ({
      value: category,
      label: projectCategories[category],
    })),
  ];

  const visible =
    filter === "all"
      ? projects
      : projects.filter((project) => project.categories.includes(filter));

  return (
    <>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: 200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring" }}
        className="my-5 flex flex-wrap justify-center gap-3 md:gap-5"
      >
        {filters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`min-h-11 rounded-full px-5 py-2.5 text-sm font-medium transition duration-300 ${
              filter === value
                ? "bg-ink text-canvas shadow-sm"
                : "surface-card surface-card-hover text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {visible.length === 0 ? (
        <div className="container mx-auto mb-10 px-10">
          <div className="surface-card rounded-2xl p-12 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              {projects.length === 0
                ? "No projects published yet"
                : "No projects match this category"}
            </p>
            <p className="mt-2 text-sm text-ink/70">
              {projects.length === 0
                ? "Projects added from the dashboard will appear here."
                : "Select “All” above to view every project."}
            </p>
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-4 min-h-11 rounded-full bg-ink px-6 py-2 text-sm font-medium text-canvas"
              >
                Show All Projects
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="container mx-auto mb-10 grid grid-cols-1 gap-4 px-10 md:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} reduceMotion={Boolean(reduceMotion)} />
          ))}
        </div>
      )}
    </>
  );
}

function ProjectCard({
  project,
  reduceMotion,
}: {
  project: Project;
  reduceMotion: boolean;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="block rounded-2xl">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring" }}
        className="surface-card surface-card-hover group relative mb-5 flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl px-5 py-20 md:px-10 md:py-2"
      >
        {project.thumbnail && (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-10 transition duration-500 group-hover:opacity-100"
          />
        )}
        <span className="absolute top-0 left-0 rounded-br-2xl border-r border-b border-ink/15 bg-canvas/85 px-4 py-2 font-mono text-sm font-medium text-ink">
          {project.year}
        </span>
        <div
          className={`z-10 text-center transition duration-500 ${
            project.thumbnail ? "group-hover:opacity-0" : ""
          }`}
        >
          <h3 className="mb-3 text-3xl font-bold text-ink">{project.title}</h3>
          <p className="text-ink/75">
            {project.summary.length > 125
              ? `${project.summary.slice(0, 125)}...`
              : project.summary}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-ink/20 bg-ink/8 px-3 py-1 text-xs font-medium text-ink"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
