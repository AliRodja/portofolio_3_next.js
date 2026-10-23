"use client";

import { startTransition, useActionState, useState } from "react";
import type { Education } from "@/db/schema";
import {
  Field,
  FormSection,
  SaveBar,
  inputClass,
  type FormState,
} from "../../_components/form";
import { MediaField } from "../../_components/media-field";
import { TagsField } from "../../_components/tags-field";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export function EducationForm({
  action,
  education,
}: {
  action: Action;
  education?: Education;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const errors = state.errors ?? {};
  const [isCurrent, setIsCurrent] = useState(
    education ? education.endYear === null : false,
  );

  return (
    <form
      // Submitting through onSubmit instead of the action prop keeps React
      // from resetting the fields when validation fails.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="space-y-8"
    >
      <FormSection title="School" description="Where you studied and what.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="School" error={errors.school}>
            <input
              name="school"
              defaultValue={education?.school}
              placeholder="University Name"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Degree or major" error={errors.degree}>
            <input
              name="degree"
              defaultValue={education?.degree}
              placeholder="Bachelor of Computer Science"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Start year" error={errors.startYear}>
            <input
              name="startYear"
              type="number"
              defaultValue={education?.startYear ?? new Date().getFullYear()}
              className={inputClass}
              required
            />
          </Field>
          <Field label="End year" error={errors.endYear}>
            <input
              name="endYear"
              type="number"
              defaultValue={education?.endYear ?? ""}
              disabled={isCurrent}
              required={!isCurrent}
              className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
            />
          </Field>
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="current"
            checked={isCurrent}
            onChange={(event) => setIsCurrent(event.target.checked)}
          />
          I am still studying here
          <span className="text-gray-500">(shown as &ldquo;Present&rdquo;)</span>
        </label>
      </FormSection>

      <FormSection title="Details" description="Shown under the photos.">
        <Field
          label="Description"
          hint={
            <>
              Optional. Separate paragraphs with a blank line. Wrap words in{" "}
              <code>**double asterisks**</code> to make them stand out.
            </>
          }
          error={errors.description}
        >
          <textarea
            name="description"
            defaultValue={education?.description.join("\n\n")}
            rows={6}
            className={inputClass}
          />
        </Field>
        <TagsField
          name="badges"
          label="Badges"
          hint="Optional short facts, e.g. GPA: 3.8 out of 4. Press Enter to add."
          placeholder="e.g. GPA: 3.8 out of 4"
          commas={false}
          defaultValue={(education?.badges ?? []).map((name) => ({ name, highlight: false }))}
          error={errors.badges}
        />
      </FormSection>

      <FormSection title="Photos" description="Campus, graduation, or activities.">
        <MediaField
          name="photos"
          label="Photos"
          hint="Up to three, shown side by side. Hovering one widens it."
          folder="education"
          aspect="portrait"
          max={3}
          defaultValue={education?.photos}
        />
      </FormSection>

      <SaveBar
        state={state}
        isPending={isPending}
        submitLabel="Save education"
        cancelHref="/admin/education"
      />
    </form>
  );
}
