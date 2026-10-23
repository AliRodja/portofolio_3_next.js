"use client";

import { useEffect, useSyncExternalStore } from "react";

// The home page section on screen. The phone tab bar lives in the layout
// while the sections live in the page, so the page reports it here instead
// of passing props up.
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

// Reports the section on screen, and clears it when the page is left or
// hidden.
export function useReportSection(id: string | undefined) {
  useEffect(() => {
    setCurrentSection(id ?? null);
    return () => setCurrentSection(null);
  }, [id]);
}
