"use client";

import { motion, useReducedMotion } from "motion/react";

export function DoubleBar({ variant = "short" }: { variant?: "short" | "long" }) {
  const reduceMotion = useReducedMotion();
  const isLong = variant === "long";
  const bar = `h-1 rounded-full bg-ink/70 ${isLong ? "w-28" : "w-20"}`;

  return (
    <div
      className={`flex flex-col ${isLong ? "items-start" : "my-5 items-center"}`}
    >
      <motion.div
        className={`${bar} ${isLong ? "mb-3" : "mb-2"}`}
        initial={reduceMotion ? false : { opacity: 0, x: isLong ? -100 : -45 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", delay: 0.2 }}
      />
      <motion.div
        className={bar}
        initial={reduceMotion ? false : { opacity: 0, x: isLong ? 200 : 150 }}
        whileInView={{ opacity: 1, x: isLong ? 50 : 40 }}
        transition={{ type: "spring", delay: 0.3 }}
      />
    </div>
  );
}
