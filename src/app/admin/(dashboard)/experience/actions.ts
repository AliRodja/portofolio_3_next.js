"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { EXPERIENCE_TAG } from "@/db/queries/experience";
import { experiences, type NewExperience } from "@/db/schema";
import { employmentTypes } from "@/lib/experience";
import { requireAdmin } from "@/lib/session";
import type { FormState } from "../_components/form";

// <input type="month"> submits YYYY-MM.
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Pick a month");

const experienceSchema = z
  .object({
    role: z.string().trim().min(1, "Role is required"),
    company: z.string().trim().min(1, "Company is required"),
    type: z.enum(employmentTypes, "Pick an employment type"),
    location: z.string().trim().min(1, "Location is required"),
    start: month,
    current: z.boolean(),
    end: z.string(),
    description: z.string().trim().min(1, "Description is required"),
    skills: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.current) return;
    if (!month.safeParse(data.end).success) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "Pick a month, or tick \"I currently work here\"" });
    } else if (data.end < data.start) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "Must be after the start month" });
    }
  });

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parseExperience(formData: FormData) {
  const result = experienceSchema.safeParse({
    role: text(formData, "role"),
    company: text(formData, "company"),
    type: text(formData, "type"),
    location: text(formData, "location"),
    start: text(formData, "start"),
    current: formData.get("current") === "on",
    end: text(formData, "end"),
    description: text(formData, "description"),
    skills: text(formData, "skills"),
  });

  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors } as const;
  }

  const data = result.data;
  const values: NewExperience = {
    role: data.role,
    company: data.company,
    type: data.type,
    location: data.location,
    startDate: `${data.start}-01`,
    endDate: data.current ? null : `${data.end}-01`,
    // Blank lines separate paragraphs.
    description: data.description.split(/\n\s*\n/).map((p) => p.trim()),
    skills: data.skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };
  return { values } as const;
}

async function submitExperience(
  formData: FormData,
  id?: number,
): Promise<FormState> {
  await requireAdmin();

  const parsed = parseExperience(formData);
  if (parsed.errors) {
    return { message: "Please fix the highlighted fields.", errors: parsed.errors };
  }

  const [saved] = id
    ? await db
        .update(experiences)
        .set(parsed.values)
        .where(eq(experiences.id, id))
        .returning({ id: experiences.id })
    : await db
        .insert(experiences)
        .values(parsed.values)
        .returning({ id: experiences.id });
  if (!saved) return { message: "This experience no longer exists." };

  updateTag(EXPERIENCE_TAG);
  redirect("/admin/experience");
}

export async function createExperience(
  _state: FormState,
  formData: FormData,
) {
  return submitExperience(formData);
}

export async function updateExperience(
  id: number,
  _state: FormState,
  formData: FormData,
) {
  return submitExperience(formData, id);
}

export async function deleteExperience(id: number) {
  await requireAdmin();
  await db.delete(experiences).where(eq(experiences.id, id));
  updateTag(EXPERIENCE_TAG);
}
