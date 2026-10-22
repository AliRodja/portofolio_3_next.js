"use client";

import { useTransition } from "react";
import { deleteProject } from "../actions";

export function DeleteProjectButton({ id, title }: { id: number; title: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        startTransition(() => deleteProject(id));
      }}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
