"use client";

import Link from "next/link";
import { startTransition, useActionState, type ReactNode } from "react";
import type { Project } from "@/db/schema";
import { projectCategories, projectCategoryKeys } from "@/lib/project-categories";
import type { ProjectFormState } from "../actions";
import { ImageField } from "./image-field";

type Action = (
  state: ProjectFormState,
  formData: FormData,
) => Promise<ProjectFormState>;

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-gray-900 focus:outline-none";

export function ProjectForm({
  action,
  project,
}: {
  action: Action;
  project?: Project;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const errors = state.errors ?? {};

  return (
    <form
      // Submitting through onSubmit instead of the action prop keeps React
      // from resetting the fields when validation fails.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="max-w-3xl space-y-6 rounded-2xl bg-white p-6 shadow-sm md:p-8"
    >
      {state.message && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Title" error={errors.title}>
          <input
            name="title"
            defaultValue={project?.title}
            className={inputClass}
            required
          />
        </Field>
        <Field
          label="Slug"
          hint="Used in the URL. Leave empty to generate it from the title."
          error={errors.slug}
        >
          <input
            name="slug"
            defaultValue={project?.slug}
            placeholder="my-project"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Summary" hint="One or two sentences for cards." error={errors.summary}>
        <textarea
          name="summary"
          defaultValue={project?.summary}
          rows={2}
          className={inputClass}
          required
        />
      </Field>

      <Field
        label="Description"
        hint="Separate paragraphs with a blank line."
        error={errors.description}
      >
        <textarea
          name="description"
          defaultValue={project?.description.join("\n\n")}
          rows={8}
          className={inputClass}
          required
        />
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Year" error={errors.year}>
          <input
            name="year"
            type="number"
            defaultValue={project?.year ?? new Date().getFullYear()}
            className={inputClass}
            required
          />
        </Field>
        <Field
          label="Technology"
          hint="Comma-separated, e.g. Next.js, TypeScript"
          error={errors.tech}
        >
          <input
            name="tech"
            defaultValue={project?.tech.join(", ")}
            className={inputClass}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Categories</legend>
        <div className="flex flex-wrap gap-4">
          {projectCategoryKeys.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="categories"
                value={category}
                defaultChecked={project?.categories.includes(category)}
              />
              {projectCategories[category]}
            </label>
          ))}
        </div>
        <FieldError error={errors.categories} />
      </fieldset>

      <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 text-sm">
        <input
          type="checkbox"
          name="highlight"
          defaultChecked={project?.highlight}
          className="mt-0.5"
        />
        <span>
          <span className="block font-medium">Highlight this project</span>
          <span className="text-gray-500">
            Shown at the top of the projects page. Replaces the current
            highlight.
          </span>
        </span>
      </label>

      <ImageField
        name="thumbnail"
        label="Thumbnail"
        hint="Shown on the project card."
        defaultValue={project?.thumbnail ? [project.thumbnail] : []}
      />
      <ImageField
        name="images"
        label="Screenshots"
        hint="Shown on the detail page. The first three appear in the highlight collage."
        multiple
        defaultValue={project?.images}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Live preview URL" error={errors.previewUrl}>
          <input
            name="previewUrl"
            type="url"
            defaultValue={project?.previewUrl ?? ""}
            placeholder="https://"
            className={inputClass}
          />
        </Field>
        <Field label="Source code URL" error={errors.sourceUrl}>
          <input
            name="sourceUrl"
            type="url"
            defaultValue={project?.sourceUrl ?? ""}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex gap-3 border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gray-900 px-5 py-2 font-medium text-white transition hover:bg-gray-700 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save project"}
        </button>
        <Link
          href="/admin/projects"
          className="rounded-lg border border-gray-300 px-5 py-2 transition hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string[];
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
      <FieldError error={error} />
    </label>
  );
}

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) return null;
  return <span className="mt-1 block text-sm text-red-600">{error[0]}</span>;
}
