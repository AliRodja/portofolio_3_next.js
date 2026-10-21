"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import {
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/data/projects";

type Filter = ProjectCategory | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...Object.entries(projectCategories).map(([value, label]) => ({
    value: value as ProjectCategory,
    label,
  })),
];

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => project.categories.includes(filter));

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === value
                ? "bg-accent text-accent-foreground"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No projects in this category yet.</p>
      )}
    </>
  );
}
