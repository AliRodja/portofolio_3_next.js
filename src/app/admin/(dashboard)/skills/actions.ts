"use server";

import { asc, desc, eq, gt, lt, max } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { SKILLS_TAG } from "@/db/queries/skills";
import { type NewSkillCategory, skillCategories } from "@/db/schema";
import { skillIconKeys } from "@/lib/skill-icons";
import { requireAdmin } from "@/lib/session";
import type { FormState } from "../_components/form";

const skillCategorySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(120, "Keep it under 120 characters"),
  icon: z.enum(skillIconKeys, "Pick an icon"),
  languages: z
    .array(
      z.object({ name: z.string().trim().min(1), highlight: z.boolean() }),
      "Add at least one technology",
    )
    .min(1, "Add at least one technology"),
  tools: z.array(z.string().trim().min(1), "Check the tools list"),
});

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function submitSkillCategory(
  formData: FormData,
  id?: number,
): Promise<FormState> {
  await requireAdmin();

  const result = skillCategorySchema.safeParse({
    title: text(formData, "title"),
    description: text(formData, "description"),
    icon: text(formData, "icon"),
    languages: parseJson(text(formData, "languages")),
    tools: parseJson(text(formData, "tools")),
  });
  if (!result.success) {
    return {
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(result.error).fieldErrors,
    };
  }
  const values: NewSkillCategory = result.data;

  if (id) {
    const [saved] = await db
      .update(skillCategories)
      .set(values)
      .where(eq(skillCategories.id, id))
      .returning({ id: skillCategories.id });
    if (!saved) return { message: "This category no longer exists." };
  } else {
    // New categories go to the end.
    const [{ last }] = await db
      .select({ last: max(skillCategories.position) })
      .from(skillCategories);
    await db
      .insert(skillCategories)
      .values({ ...values, position: (last ?? -1) + 1 });
  }

  updateTag(SKILLS_TAG);
  redirect("/admin/skills");
}

export async function createSkillCategory(
  _state: FormState,
  formData: FormData,
) {
  return submitSkillCategory(formData);
}

export async function updateSkillCategory(
  id: number,
  _state: FormState,
  formData: FormData,
) {
  return submitSkillCategory(formData, id);
}

export async function deleteSkillCategory(id: number) {
  await requireAdmin();
  await db.delete(skillCategories).where(eq(skillCategories.id, id));
  updateTag(SKILLS_TAG);
}

// Swaps a category with its neighbor above or below.
export async function moveSkillCategory(id: number, direction: "up" | "down") {
  await requireAdmin();

  await db.transaction(async (tx) => {
    const [current] = await tx
      .select({ id: skillCategories.id, position: skillCategories.position })
      .from(skillCategories)
      .where(eq(skillCategories.id, id));
    if (!current) return;

    const isUp = direction === "up";
    const [neighbor] = await tx
      .select({ id: skillCategories.id, position: skillCategories.position })
      .from(skillCategories)
      .where(
        isUp
          ? lt(skillCategories.position, current.position)
          : gt(skillCategories.position, current.position),
      )
      .orderBy(
        isUp ? desc(skillCategories.position) : asc(skillCategories.position),
      )
      .limit(1);
    if (!neighbor) return;

    await tx
      .update(skillCategories)
      .set({ position: neighbor.position })
      .where(eq(skillCategories.id, current.id));
    await tx
      .update(skillCategories)
      .set({ position: current.position })
      .where(eq(skillCategories.id, neighbor.id));
  });

  updateTag(SKILLS_TAG);
}
