"use client";

import { useEffect, useSyncExternalStore } from "react";

// Shared store so FullPage can report the active home section to TabBar in the parent layout.
let currentSection: string | null = null;
const listeners = new Set<() => void>();

function setCurrentSection(id: string | null) {
  currentSection = id;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCurrentSection() {
  return useSyncExternalStore(
    subscribe,
    () => currentSection,
    () => null,
  );
}

export function useReportSection(id: string | undefined) {
  useEffect(() => {
    setCurrentSection(id ?? null);
    return () => setCurrentSection(null);
  }, [id]);
}
