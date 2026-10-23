import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { skillCategories } from "@/db/schema";

export const SKILLS_TAG = "skills";

// In the order set in the dashboard. Cached until a dashboard change calls
// updateTag(SKILLS_TAG).
export async function getSkillCategories() {
  "use cache";
  cacheTag(SKILLS_TAG);
  cacheLife("max");

  return db
    .select()
    .from(skillCategories)
    .orderBy(asc(skillCategories.position), asc(skillCategories.id));
}

// Uncached, for the dashboard edit form.
export async function getSkillCategoryById(id: number) {
  const [category] = await db
    .select()
    .from(skillCategories)
    .where(eq(skillCategories.id, id))
    .limit(1);
  return category;
}
