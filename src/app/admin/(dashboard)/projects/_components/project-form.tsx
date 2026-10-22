"use client";

import { startTransition, useActionState } from "react";
import type { Project } from "@/db/schema";
import { projectCategories, projectCategoryKeys } from "@/lib/project-categories";
import {
  Field,
  FieldError,
  FormSection,
  SaveBar,
  inputClass,
  type FormState,
} from "../../_components/form";
import { MediaField } from "../../_components/media-field";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

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
      className="space-y-6"
    >
      <FormSection title="Details" description="What the project is and does.">
        <div className="grid gap-5 md:grid-cols-2">
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
        <Field
          label="Summary"
          hint="One or two sentences for the project card."
          error={errors.summary}
        >
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
          hint="Shown on the detail page. Separate paragraphs with a blank line."
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
      </FormSection>

      <FormSection title="Classification" description="Used for sorting and filtering.">
        <div className="grid gap-5 md:grid-cols-2">
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
          <div className="flex flex-wrap gap-2">
            {projectCategoryKeys.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm transition has-checked:border-gray-900 has-checked:bg-gray-900 has-checked:text-white"
              >
                <input
                  type="checkbox"
                  name="categories"
                  value={category}
                  defaultChecked={project?.categories.includes(category)}
                  className="sr-only"
                />
                {projectCategories[category]}
              </label>
            ))}
          </div>
          <FieldError error={errors.categories} />
        </fieldset>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 text-sm transition has-checked:border-yellow-300 has-checked:bg-yellow-50">
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
      </FormSection>

      <FormSection title="Media">
        <MediaField
          name="thumbnail"
          label="Thumbnail"
          hint="Shown on the project card."
          folder="projects"
          defaultValue={project?.thumbnail ? [project.thumbnail] : []}
        />
        <MediaField
          name="images"
          label="Screenshots"
          hint="Shown on the detail page. The first three appear in the highlight collage."
          folder="projects"
          max={12}
          defaultValue={project?.images}
        />
      </FormSection>

      <FormSection title="Links">
        <div className="grid gap-5 md:grid-cols-2">
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
      </FormSection>

      <SaveBar
        state={state}
        isPending={isPending}
        submitLabel="Save project"
        cancelHref="/admin/projects"
      />
    </form>
  );
}
