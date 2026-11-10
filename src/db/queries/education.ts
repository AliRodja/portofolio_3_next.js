import { desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { achievements, educations } from "@/db/schema";

export const EDUCATION_TAG = "education";

export async function getEducations() {
  "use cache";
  cacheTag(EDUCATION_TAG);
  cacheLife("max");

  return db
    .select()
    .from(educations)
    .orderBy(
      sql`${educations.endYear} is null desc`,
      desc(educations.startYear),
      desc(educations.endYear),
    );
}

export async function getAchievements() {
  "use cache";
  cacheTag(EDUCATION_TAG);
  cacheLife("max");

  return db
    .select()
    .from(achievements)
    .orderBy(desc(achievements.date), desc(achievements.id));
}

// Uncached, for the dashboard edit forms.
export async function getEducationById(id: number) {
  const [education] = await db
    .select()
    .from(educations)
    .where(eq(educations.id, id))
    .limit(1);
  return education;
}

export async function getAchievementById(id: number) {
  const [achievement] = await db
    .select()
    .from(achievements)
    .where(eq(achievements.id, id))
    .limit(1);
  return achievement;
}
