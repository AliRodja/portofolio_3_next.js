"use client";

import { startTransition, useActionState } from "react";
import type { Achievement } from "@/db/schema";
import { toMonthInput } from "@/lib/dates";
import { achievementTypeKeys, achievementTypes } from "@/lib/education";
import {
  Field,
  FieldError,
  FormSection,
  SaveBar,
  inputClass,
  type FormState,
} from "../../_components/form";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export function AchievementForm({
  action,
  achievement,
}: {
  action: Action;
  achievement?: Achievement;
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
        title="Achievement"
        description="Listed newest first and grouped by year on the About page."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" error={errors.title}>
            <input
              name="title"
              defaultValue={achievement?.title}
              placeholder="1st place (Gold Medal)"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Event" error={errors.event}>
            <input
              name="event"
              defaultValue={achievement?.event}
              placeholder="National Programming Contest"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Month" error={errors.date}>
            <input
              name="date"
              type="month"
              defaultValue={toMonthInput(achievement?.date)}
              className={inputClass}
              required
            />
          </Field>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Type</legend>
          <div className="flex flex-wrap gap-2">
            {achievementTypeKeys.map((type, index) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm transition has-checked:border-gray-900 has-checked:bg-gray-900 has-checked:text-white"
              >
                <input
                  type="radio"
                  name="type"
                  value={type}
                  defaultChecked={achievement ? achievement.type === type : index === 0}
                  className="sr-only"
                />
                {achievementTypes[type]}
              </label>
            ))}
          </div>
          <FieldError error={errors.type} />
        </fieldset>
      </FormSection>

      <SaveBar
        state={state}
        isPending={isPending}
        submitLabel="Save achievement"
        cancelHref="/admin/education"
      />
    </form>
  );
}
