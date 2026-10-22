"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type FullPageSectionConfig = {
  id: string;
  label: string;
  icon: IconDefinition;
};

// A full-screen scroll container that snaps one section at a time,
// with a sidebar that highlights and jumps to the active section.
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className="no-scrollbar h-dvh snap-y snap-mandatory overflow-x-hidden overflow-y-auto"
    >
      <aside className="fixed top-1/4 left-0 z-40 hidden h-[50vh] w-14 flex-col items-center rounded-e-3xl bg-gray-700 p-4 md:flex">
        <ul className="flex h-full flex-col items-center justify-evenly text-gray-50">
          {sections.map((section, index) => (
            <li key={section.id}>
              <button
                type="button"
                aria-label={`Go to ${section.label} section`}
                aria-current={activeIndex === index}
                onClick={() => scrollTo(section.id)}
                className="relative flex h-10 w-10 items-center justify-center"
              >
                {activeIndex === index && (
                  <motion.span
                    layoutId="fullpage-active"
                    className="absolute inset-0 rounded-xl bg-gray-500"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <FontAwesomeIcon
                  icon={section.icon}
                  className={`relative text-xl transition-transform duration-300 ${
                    activeIndex === index ? "scale-110" : ""
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {children}

      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            className="pointer-events-none fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, delay: 1.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <span className="text-[10px] font-medium tracking-[4px] text-gray-500 uppercase">
              Scroll
            </span>
            <motion.span
              className="h-14 w-[1.5px] origin-top bg-gray-500"
              animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
      className="relative flex min-h-dvh w-full snap-start snap-always items-center justify-center overflow-hidden"
    >
      {children}
    </section>
  );
}
