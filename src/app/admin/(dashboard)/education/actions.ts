"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { EDUCATION_TAG } from "@/db/queries/education";
import {
  achievements,
  educations,
  type NewAchievement,
  type NewEducation,
} from "@/db/schema";
import { achievementTypeKeys } from "@/lib/education";
import { requireAdmin } from "@/lib/session";
import { mediaUrl } from "@/lib/validation";
import type { FormState } from "../_components/form";

const year = z.coerce
  .number<string>({ error: "Enter a valid year" })
  .int("Enter a valid year")
  .min(1950, "Enter a valid year")
  .max(2100, "Enter a valid year");

const educationSchema = z
  .object({
    school: z.string().trim().min(1, "School is required"),
    degree: z.string().trim().min(1, "Degree or major is required"),
    startYear: year,
    current: z.boolean(),
    endYear: z.string(),
    description: z.string().trim(),
    badges: z.array(z.string().trim().min(1), "Check the badges list"),
    photos: z.array(mediaUrl).max(3, "Up to three photos"),
  })
  .superRefine((data, ctx) => {
    if (data.current) return;
    const end = year.safeParse(data.endYear);
    if (!end.success) {
      ctx.addIssue({ code: "custom", path: ["endYear"], message: "Enter a year, or tick \"I am still studying here\"" });
    } else if (end.data < data.startYear) {
      ctx.addIssue({ code: "custom", path: ["endYear"], message: "Must be the start year or later" });
    }
  });

const achievementSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  event: z.string().trim().min(1, "Event is required"),
  // <input type="month"> submits YYYY-MM.
  date: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Pick a month"),
  type: z.enum(achievementTypeKeys, "Pick a type"),
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

const invalid = (error: z.ZodError): FormState => ({
  message: "Please fix the highlighted fields.",
  errors: z.flattenError(error).fieldErrors,
});

async function submitEducation(formData: FormData, id?: number): Promise<FormState> {
  await requireAdmin();

  const result = educationSchema.safeParse({
    school: text(formData, "school"),
    degree: text(formData, "degree"),
    startYear: text(formData, "startYear"),
    current: formData.get("current") === "on",
    endYear: text(formData, "endYear"),
    description: text(formData, "description"),
    badges: parseJson(text(formData, "badges")),
    photos: formData.getAll("photos"),
  });
  if (!result.success) return invalid(result.error);

  const data = result.data;
  const values: NewEducation = {
    school: data.school,
    degree: data.degree,
    startYear: data.startYear,
    endYear: data.current ? null : Number(data.endYear),
    // Blank lines separate paragraphs. Optional.
    description: data.description
      ? data.description.split(/\n\s*\n/).map((p) => p.trim())
      : [],
    badges: data.badges,
    photos: data.photos,
  };

  const [saved] = id
    ? await db
        .update(educations)
        .set(values)
        .where(eq(educations.id, id))
        .returning({ id: educations.id })
    : await db.insert(educations).values(values).returning({ id: educations.id });
  if (!saved) return { message: "This education no longer exists." };

  updateTag(EDUCATION_TAG);
  redirect("/admin/education");
}

async function submitAchievement(formData: FormData, id?: number): Promise<FormState> {
  await requireAdmin();

  const result = achievementSchema.safeParse({
    title: text(formData, "title"),
    event: text(formData, "event"),
    date: text(formData, "date"),
    type: text(formData, "type"),
  });
  if (!result.success) return invalid(result.error);

  const values: NewAchievement = {
    ...result.data,
    date: `${result.data.date}-01`,
  };

  const [saved] = id
    ? await db
        .update(achievements)
        .set(values)
        .where(eq(achievements.id, id))
        .returning({ id: achievements.id })
    : await db.insert(achievements).values(values).returning({ id: achievements.id });
  if (!saved) return { message: "This achievement no longer exists." };

  updateTag(EDUCATION_TAG);
  redirect("/admin/education");
}

export async function createEducation(_state: FormState, formData: FormData) {
  return submitEducation(formData);
}

export async function updateEducation(id: number, _state: FormState, formData: FormData) {
  return submitEducation(formData, id);
}

export async function deleteEducation(id: number) {
  await requireAdmin();
  await db.delete(educations).where(eq(educations.id, id));
  updateTag(EDUCATION_TAG);
}

export async function createAchievement(_state: FormState, formData: FormData) {
  return submitAchievement(formData);
}

export async function updateAchievement(id: number, _state: FormState, formData: FormData) {
  return submitAchievement(formData, id);
}

export async function deleteAchievement(id: number) {
  await requireAdmin();
  await db.delete(achievements).where(eq(achievements.id, id));
  updateTag(EDUCATION_TAG);
}
