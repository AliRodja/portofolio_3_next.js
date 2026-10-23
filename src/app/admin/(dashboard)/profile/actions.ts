"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { PROFILE_TAG } from "@/db/queries/profile";
import { type ProfileData, profile } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { socialIconKeys } from "@/lib/social-icons";
import { httpUrl, mediaUrl, optionalMediaUrl } from "@/lib/validation";
import type { FormState } from "../_components/form";

const required = (message: string) => z.string().trim().min(1, message);

const profileSchema = z.object({
  name: required("Display name is required"),
  fullName: required("Full name is required"),
  role: required("Role is required"),
  email: z.email("Enter a valid email"),
  intro: required("Intro is required"),
  about: required("Write at least one paragraph"),
  description: required("Description is required").max(
    300,
    "Keep it under 300 characters",
  ),
  cvUrl: optionalMediaUrl,
  heroPhoto: optionalMediaUrl,
  aboutPhoto: optionalMediaUrl,
  projectsPhoto: optionalMediaUrl,
  contactPhoto: optionalMediaUrl,
  collagePhotos: z.array(mediaUrl).max(3),
  socials: z.array(
    z.object({
      label: z.string().trim().min(1),
      href: httpUrl,
      icon: z.enum(socialIconKeys),
    }),
  ),
  quoteLine1: z.string().trim(),
  quoteLine2: z.string().trim(),
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

export async function saveProfile(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const result = profileSchema.safeParse({
    name: text(formData, "name"),
    fullName: text(formData, "fullName"),
    role: text(formData, "role"),
    email: text(formData, "email").trim(),
    intro: text(formData, "intro"),
    about: text(formData, "about"),
    description: text(formData, "description"),
    cvUrl: text(formData, "cvUrl"),
    heroPhoto: text(formData, "heroPhoto"),
    aboutPhoto: text(formData, "aboutPhoto"),
    projectsPhoto: text(formData, "projectsPhoto"),
    contactPhoto: text(formData, "contactPhoto"),
    collagePhotos: formData.getAll("collagePhotos"),
    socials: parseJson(text(formData, "socials")),
    quoteLine1: text(formData, "quoteLine1"),
    quoteLine2: text(formData, "quoteLine2"),
  });

  if (!result.success) {
    const errors: FormState["errors"] = z.flattenError(result.error).fieldErrors;
    // Nested errors are hard to point at, so describe the rule instead.
    if (errors.socials) {
      errors.socials = ["Every link needs a label and a full URL (https://...)."];
    }
    return { message: "Please fix the highlighted fields.", errors };
  }

  const data = result.data;
  const values: ProfileData = {
    ...data,
    // Blank lines separate paragraphs.
    about: data.about.split(/\n\s*\n/).map((paragraph) => paragraph.trim()),
    cvUrl: data.cvUrl || null,
    heroPhoto: data.heroPhoto || null,
    aboutPhoto: data.aboutPhoto || null,
    projectsPhoto: data.projectsPhoto || null,
    contactPhoto: data.contactPhoto || null,
  };

  await db
    .insert(profile)
    .values({ id: 1, ...values })
    .onConflictDoUpdate({ target: profile.id, set: values });

  updateTag(PROFILE_TAG);
  return { success: true, message: "Profile saved." };
}
