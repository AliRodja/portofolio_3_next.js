"use client";

import { startTransition, useActionState, useState } from "react";
import type { Experience } from "@/db/schema";
import { employmentTypes } from "@/lib/experience";
import {
  Field,
  FormSection,
  SaveBar,
  inputClass,
  type FormState,
} from "../../_components/form";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

// Stored as the first of the month; <input type="month"> wants YYYY-MM.
const toMonth = (date?: string | null) => date?.slice(0, 7) ?? "";

export function ExperienceForm({
  action,
  experience,
}: {
  action: Action;
  experience?: Experience;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const errors = state.errors ?? {};
  const [isCurrent, setIsCurrent] = useState(
    experience ? experience.endDate === null : true,
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
      <FormSection title="Position" description="The role and where you held it.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Role" error={errors.role}>
            <input
              name="role"
              defaultValue={experience?.role}
              placeholder="Software Engineer"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Company" error={errors.company}>
            <input
              name="company"
              defaultValue={experience?.company}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Employment type" error={errors.type}>
            <select
              name="type"
              defaultValue={experience?.type ?? "Full-time"}
              className={inputClass}
            >
              {employmentTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </Field>
          <Field
            label="Location"
            hint="A city, a country, or Remote."
            error={errors.location}
          >
            <input
              name="location"
              defaultValue={experience?.location}
              placeholder="Jakarta, Indonesia"
              className={inputClass}
              required
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title="Period"
        description="Only the month and year are shown. The timeline is ordered newest first."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Start" error={errors.start}>
            <input
              name="start"
              type="month"
              defaultValue={toMonth(experience?.startDate)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="End" error={errors.end}>
            <input
              name="end"
              type="month"
              defaultValue={toMonth(experience?.endDate)}
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
          I currently work here
          <span className="text-gray-500">(shown as &ldquo;Present&rdquo;)</span>
        </label>
      </FormSection>

      <FormSection title="Details" description="What you did there.">
        <Field
          label="Description"
          hint="What you built, the impact it had, and the tools you used. Separate paragraphs with a blank line."
          error={errors.description}
        >
          <textarea
            name="description"
            defaultValue={experience?.description.join("\n\n")}
            rows={6}
            className={inputClass}
            required
          />
        </Field>
        <Field
          label="Skills"
          hint="Comma-separated, e.g. Next.js, TypeScript"
          error={errors.skills}
        >
          <input
            name="skills"
            defaultValue={experience?.skills.join(", ")}
            className={inputClass}
          />
        </Field>
      </FormSection>

      <SaveBar
        state={state}
        isPending={isPending}
        submitLabel="Save experience"
        cancelHref="/admin/experience"
      />
    </form>
  );
}
