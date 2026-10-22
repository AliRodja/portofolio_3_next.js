"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// Wrap a page's content in this to fade it in and play its entrance every
// time you navigate to it.
//
// With Cache Components, Next keeps the pages you visited mounted but hidden
// (React <Activity>), so coming back to one would show it exactly as you
// left it, with none of its animations (the hero zoom, the reveals) playing
// again. Keying on bfcacheId mounts the page fresh on every link click while
// back and forward still restore it where you were. bfcacheId belongs to the
// segment the caller renders in, so this has to sit inside each page, not in
// a shared layout or template.
//
// Only opacity animates: a transform or filter here would become the
// containing block for the pages' fixed elements (the home page's scroll
// container and island) and pin them to this wrapper instead of the screen.
export function PageTransition({ children }: { children: ReactNode }) {
  const { bfcacheId } = useRouter();

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
