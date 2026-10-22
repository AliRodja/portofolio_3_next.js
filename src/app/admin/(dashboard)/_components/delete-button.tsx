"use client";

import { useTransition } from "react";

// Asks for confirmation, then runs a delete Server Action bound to one item,
// e.g. action={deleteProject.bind(null, project.id)}.
export function DeleteButton({
  action,
  title,
}: {
  action: () => Promise<void>;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        startTransition(() => action());
      }}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
