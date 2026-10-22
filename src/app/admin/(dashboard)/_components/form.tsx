import Link from "next/link";
import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50";

export type FormState = {
  success?: boolean;
  message?: string;
  errors?: Partial<Record<string, string[]>>;
};

// A settings-style section: the heading and explanation sit in a column on
// the left on wide screens, with the fields in a card on the right.
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-b border-gray-200 pb-8 last-of-type:border-b-0 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-xs md:p-6">
        {children}
      </div>
    </section>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: string[];
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-gray-500">{hint}</span>}
      <FieldError error={error} />
    </label>
  );
}

export function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) return null;
  return <span className="mt-1.5 block text-sm text-red-600">{error[0]}</span>;
}

// Floats at the bottom of the content column so saving is always one click
// away, without covering the sidebar.
export function SaveBar({
  state,
  isPending,
  submitLabel = "Save changes",
  cancelHref,
}: {
  state: FormState;
  isPending: boolean;
  submitLabel?: string;
  cancelHref?: string;
}) {
  return (
    <div className="sticky bottom-4 z-10 mt-2 flex flex-wrap items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
      {state.message && !isPending && (
        <p
          role="status"
          className={`mr-auto text-sm ${state.success ? "text-green-700" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
      {cancelHref && (
        <Link href={cancelHref} className={secondaryButtonClass}>
          Cancel
        </Link>
      )}
      <button type="submit" disabled={isPending} className={primaryButtonClass}>
        {isPending ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}
