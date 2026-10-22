"use client";

import { motion } from "motion/react";
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

  // Only show category buttons that have at least one project.
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
        initial={{ opacity: 0, x: 200 }}
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
            className={`rounded-full px-4 py-2 text-sm font-medium transition duration-300 md:px-5 ${
              filter === value
                ? "bg-white text-gray-900 shadow-md"
                : "glass glass-hover text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      <div className="container mx-auto mb-10 grid grid-cols-1 gap-4 px-10 md:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}

// The thumbnail is dimmed behind the text and fades in fully on hover.
function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring" }}
        className="glass glass-hover group mb-5 flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl px-5 py-20 md:px-10 md:py-2"
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
        <span className="absolute top-0 left-0 rounded-br-2xl bg-black/30 px-4 py-2 font-display text-white backdrop-blur-sm">
          {project.year}
        </span>
        <div
          className={`z-10 text-center transition duration-500 ${
            project.thumbnail ? "group-hover:opacity-0" : ""
          }`}
        >
          <h3 className="mb-3 text-3xl font-bold">{project.title}</h3>
          <p className="text-white/75">
            {project.summary.length > 125
              ? `${project.summary.slice(0, 125)}...`
              : project.summary}
          </p>
          <div className="mt-5 flex flex-wrap justify-center">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="m-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white"
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
