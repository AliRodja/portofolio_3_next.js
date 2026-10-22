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

// A card grouping related fields under a heading.
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
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-4 md:px-6">
        <h2 className="font-semibold">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="space-y-5 p-5 md:p-6">{children}</div>
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

// Stays at the bottom of the screen so saving is always one click away.
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
    <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 bg-white/90 px-5 py-4 backdrop-blur md:-mx-10 md:px-10">
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
