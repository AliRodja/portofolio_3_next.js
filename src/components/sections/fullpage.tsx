"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReportSection } from "@/components/layout/current-place";
import { DynamicIsland } from "@/components/layout/dynamic-island";
import { LightStreaks } from "@/components/layout/glass-backdrop";

export type FullPageSectionConfig = {
  id: string;
  label: string;
  icon: IconDefinition;
};

export function FullPage({
  sections,
  children,
}: {
  sections: FullPageSectionConfig[];
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollTargetRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  useReportSection(sections[activeIndex]?.id);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // A section is active while it crosses the vertical middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = sections.findIndex((s) => s.id === entry.target.id);
          if (index === -1) continue;
          if (scrollTargetRef.current !== null && index !== scrollTargetRef.current) {
            continue;
          }
          scrollTargetRef.current = null;
          setActiveIndex(index);
          if (index > 0) setHasScrolled(true);
        }
      },
      { root: container, rootMargin: "-50% 0px -50% 0px" },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const targetIndex = sections.findIndex((s) => s.id === id);
    if (targetIndex !== -1) {
      scrollTargetRef.current = targetIndex;
      setActiveIndex(targetIndex);
      if (targetIndex > 0) setHasScrolled(true);
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = window.setTimeout(() => {
        scrollTargetRef.current = null;
      }, 750);
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      ref={containerRef}
      data-scroll-root
      className="no-scrollbar h-dvh snap-y snap-mandatory overflow-x-hidden overflow-y-auto"
    >
      <LightStreaks variant="hero" />
      <DynamicIsland
        items={sections.map((section) => ({
          key: section.id,
          label: section.label,
          icon: section.icon,
        }))}
        activeIndex={activeIndex}
        onSelect={(item) => scrollTo(item.key)}
        label="Page sections"
        bubbleId="island-active"
      />

      {children}

      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            className="pointer-events-none fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3 max-md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, delay: 1.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <span className="text-[10px] font-medium tracking-[0.2em] text-ink/70 uppercase">
              Scroll
            </span>
            <motion.span
              className="h-14 w-[1.5px] origin-top bg-ink/70"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export function FullPageSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      // On phones the bottom padding keeps content clear of the tab bar.
      className="relative flex min-h-dvh w-full snap-start snap-always items-center justify-center overflow-hidden max-md:pb-24"
    >
      {children}
    </section>
  );
}
