import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { defaultProfile } from "@/lib/default-profile";

export const PROFILE_TAG = "profile";

// Cached until the dashboard saves the profile. Falls back to the defaults on
// a fresh database so the site always renders.
export async function getProfile() {
  "use cache";
  cacheTag(PROFILE_TAG);
  cacheLife("max");

  const [row] = await db
    .select()
    .from(profile)
    .where(eq(profile.id, 1))
    .limit(1);
  return row ?? { ...defaultProfile, updatedAt: null };
}
