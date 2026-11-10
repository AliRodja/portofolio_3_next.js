"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const { bfcacheId } = useRouter();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div key={bfcacheId}>{children}</div>;
  }

  return (
    <motion.div
      key={bfcacheId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
