"use client";

import { useEffect } from "react";
import { GlassBackdrop } from "@/components/layout/glass-backdrop";

// Clear any leftover data-glass attribute so all surfaces use the CSS glass styles.
export function GlassStage() {
  useEffect(() => {
    delete document.documentElement.dataset.glass;
  }, []);

  return <GlassBackdrop />;
}
