"use server";

import { and, eq, ne } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { PROJECTS_TAG } from "@/db/queries/projects";
import { type NewProject, projects } from "@/db/schema";
import { projectCategoryKeys } from "@/lib/project-categories";
import { requireAdmin } from "@/lib/session";
import { mediaUrl, optionalHttpUrl, optionalMediaUrl } from "@/lib/validation";
import type { FormState } from "../_components/form";

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and dashes",
    ),
  summary: z.string().trim().min(1, "Summary is required"),
  description: z.string().trim().min(1, "Description is required"),
  year: z.coerce
    .number<string>({ error: "Enter a valid year" })
    .int("Enter a valid year")
    .min(1990, "Enter a valid year")
    .max(2100, "Enter a valid year"),
  tech: z.string(),
  categories: z
    .array(z.enum(projectCategoryKeys))
    .min(1, "Pick at least one category"),
  highlight: z.boolean(),
  thumbnail: optionalMediaUrl,
  images: z.array(mediaUrl),
  previewUrl: optionalHttpUrl,
  sourceUrl: optionalHttpUrl,
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parseProject(formData: FormData) {
  const title = text(formData, "title");
  const result = projectSchema.safeParse({
    title,
    slug: text(formData, "slug").trim() || slugify(title),
    summary: text(formData, "summary"),
    description: text(formData, "description"),
    year: text(formData, "year"),
    tech: text(formData, "tech"),
    categories: formData.getAll("categories"),
    highlight: formData.get("highlight") === "on",
    thumbnail: text(formData, "thumbnail"),
    images: formData.getAll("images"),
    previewUrl: text(formData, "previewUrl").trim(),
    sourceUrl: text(formData, "sourceUrl").trim(),
  });

  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors } as const;
  }

  const data = result.data;
  const values: NewProject = {
    ...data,
    // Blank lines separate paragraphs.
    description: data.description.split(/\n\s*\n/).map((p) => p.trim()),
    tech: data.tech
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    thumbnail: data.thumbnail || null,
    previewUrl: data.previewUrl || null,
    sourceUrl: data.sourceUrl || null,
  };
  return { values } as const;
}

// Drizzle may wrap the Postgres error, so check its cause too.
function isUniqueViolation(error: unknown) {
  const { code, cause } = (error ?? {}) as {
    code?: string;
    cause?: { code?: string };
  };
  return code === "23505" || cause?.code === "23505";
}

// Only one project can be highlighted. Saving one with the flag clears it
// from the rest.
async function saveProject(values: NewProject, id?: number) {
  return db.transaction(async (tx) => {
    const [saved] = id
      ? await tx
          .update(projects)
          .set(values)
          .where(eq(projects.id, id))
          .returning({ id: projects.id })
      : await tx.insert(projects).values(values).returning({ id: projects.id });

    if (saved && values.highlight) {
      await tx
        .update(projects)
        .set({ highlight: false })
        .where(and(eq(projects.highlight, true), ne(projects.id, saved.id)));
    }
    return saved;
  });
}

async function submitProject(
  formData: FormData,
  id?: number,
): Promise<FormState> {
  await requireAdmin();

  const parsed = parseProject(formData);
  if (parsed.errors) {
    return { message: "Please fix the highlighted fields.", errors: parsed.errors };
  }

  try {
    const saved = await saveProject(parsed.values, id);
    if (!saved) return { message: "This project no longer exists." };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        message: "Please fix the highlighted fields.",
        errors: { slug: ["Another project already uses this slug"] },
      };
    }
    throw error;
  }

  updateTag(PROJECTS_TAG);
  redirect("/admin/projects");
}

export async function createProject(
  _state: FormState,
  formData: FormData,
) {
  return submitProject(formData);
}

export async function updateProject(
  id: number,
  _state: FormState,
  formData: FormData,
) {
  return submitProject(formData, id);
}

export async function deleteProject(id: number) {
  await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  updateTag(PROJECTS_TAG);
}
