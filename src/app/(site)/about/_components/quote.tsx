"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

// Each word un-blurs one after another when the quote scrolls into view.
export function Quote({ lines }: { lines: [string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.1 });
  const [first, second] = lines.map((line) => line.split(" ").filter(Boolean));
  if (first.length + second.length === 0) return null;

  const word = (text: string, order: number) => (
    <motion.span
      key={order}
      className="inline-block"
      initial={{ opacity: 0, filter: "blur(4px)", scale: 0.92 }}
      animate={
        isInView
          ? { opacity: 1, filter: "blur(0px)", scale: 1 }
          : { opacity: 0, filter: "blur(4px)", scale: 0.92 }
      }
      transition={{ delay: isInView ? order * 0.1 : 0, duration: 0.5 }}
    >
      {text}&nbsp;
    </motion.span>
  );

  return (
    <section className="container mx-auto mt-10 flex min-h-[80vh] items-center justify-center p-10">
      <motion.div
        ref={ref}
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-display text-[2rem]">
          {first.map((text, index) => word(text, index))}
        </p>
        <p className="font-display text-xl">
          {second.map((text, index) => word(text, first.length + index))}
        </p>
      </motion.div>
    </section>
  );
}
