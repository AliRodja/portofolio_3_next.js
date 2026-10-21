"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type From = "left" | "right" | "up" | "none";

function initialOffset(from: From, distance: number) {
  switch (from) {
    case "left":
      return { x: -distance };
    case "right":
      return { x: distance };
    case "up":
      return { y: distance * 0.4 };
    case "none":
      return {};
  }
}

// Slides and fades its children in every time they scroll into view.
export function Reveal({
  children,
  from = "left",
  distance = 100,
  delay = 0,
  className,
}: {
  children: ReactNode;
  from?: From;
  distance?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initialOffset(from, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}
