"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { startTransition, useActionState } from "react";
import type { SkillCategory } from "@/db/schema";
import { skillIconKeys, skillIcons } from "@/lib/skill-icons";
import {
  Field,
  FieldError,
  FormSection,
  SaveBar,
  inputClass,
  type FormState,
} from "../../_components/form";
import { TagsField } from "../../_components/tags-field";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export function SkillCategoryForm({
  action,
  category,
}: {
  action: Action;
  category?: SkillCategory;
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
      className="space-y-8"
    >
      <FormSection
        title="Category"
        description="The card visitors click on the About page."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" error={errors.title}>
            <input
              name="title"
              defaultValue={category?.title}
              placeholder="Web Development"
              className={inputClass}
              required
            />
          </Field>
          <Field
            label="Description"
            hint="One short line under the title."
            error={errors.description}
          >
            <input
              name="description"
              defaultValue={category?.description}
              placeholder="Building modern, responsive web applications"
              maxLength={120}
              className={inputClass}
              required
            />
          </Field>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Icon</legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {skillIconKeys.map((key, index) => (
              <label
                key={key}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-gray-200 px-2 py-3 text-xs text-gray-600 transition hover:border-gray-300 has-checked:border-gray-900 has-checked:bg-gray-900 has-checked:text-white"
              >
                <input
                  type="radio"
                  name="icon"
                  value={key}
                  defaultChecked={category ? category.icon === key : index === 0}
                  className="sr-only"
                />
                <FontAwesomeIcon icon={skillIcons[key].icon} className="text-lg" />
                {skillIcons[key].label}
              </label>
            ))}
          </div>
          <FieldError error={errors.icon} />
        </fieldset>
      </FormSection>

      <FormSection
        title="Skills"
        description="Star the ones you know best. They stand out in white."
      >
        <TagsField
          name="languages"
          label="Technology stack"
          hint="Languages and frameworks. Press Enter or type a comma to add."
          placeholder="e.g. Next.js"
          highlightable
          defaultValue={category?.languages ?? []}
          error={errors.languages}
        />
        <TagsField
          name="tools"
          label="Infrastructure & tools"
          hint="Optional. Services and apps you work with."
          placeholder="e.g. Docker"
          defaultValue={(category?.tools ?? []).map((name) => ({ name, highlight: false }))}
          error={errors.tools}
        />
      </FormSection>

      <SaveBar
        state={state}
        isPending={isPending}
        submitLabel="Save category"
        cancelHref="/admin/skills"
      />
    </form>
  );
}
