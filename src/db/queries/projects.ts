import { desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { projects } from "@/db/schema";

export const PROJECTS_TAG = "projects";

export async function getProjects() {
  "use cache";
  cacheTag(PROJECTS_TAG);
  cacheLife("max");

  return db
    .select()
    .from(projects)
    .orderBy(desc(projects.year), desc(projects.createdAt));
}

// Query by slug directly so newly added projects never read from a stale list cache.
export async function getProject(slug: string) {
  "use cache";
  cacheTag(PROJECTS_TAG);
  cacheLife("max");

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  return project;
}

// Uncached, for the dashboard edit form.
export async function getProjectById(id: number) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return project;
}
