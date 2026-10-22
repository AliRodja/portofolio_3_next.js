import { desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { experiences } from "@/db/schema";

export const EXPERIENCE_TAG = "experience";

// Newest first: current positions on top, then by when each one started.
// Cached until a dashboard change calls updateTag(EXPERIENCE_TAG).
export async function getExperiences() {
  "use cache";
  cacheTag(EXPERIENCE_TAG);
  cacheLife("max");

  return db
    .select()
    .from(experiences)
    .orderBy(
      sql`${experiences.endDate} is null desc`,
      desc(experiences.startDate),
      desc(experiences.endDate),
    );
}

// Uncached, for the dashboard edit form.
export async function getExperienceById(id: number) {
  const [experience] = await db
    .select()
    .from(experiences)
    .where(eq(experiences.id, id))
    .limit(1);
  return experience;
}
