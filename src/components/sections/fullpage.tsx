"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReportSection } from "@/components/layout/current-place";
import { LightStreaks } from "@/components/layout/glass-backdrop";

export type FullPageSectionConfig = {
  id: string;
  label: string;
  icon: IconDefinition;
};

// A full-screen scroll container that snaps one section at a time, with a
// floating island at the top that highlights and jumps to the active section.
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
  // For the phone tab bar.
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
      data-scroll-root
      className="no-scrollbar h-dvh snap-y snap-mandatory overflow-x-hidden overflow-y-auto"
    >
      <LightStreaks variant="hero" />
      <SectionIsland
        sections={sections}
        activeIndex={activeIndex}
        onSelect={scrollTo}
      />

      {children}

      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            // Hidden on phones, where the tab bar takes the bottom and the
            // island's dots already show there is more below.
            className="pointer-events-none fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3 max-md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, delay: 1.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <span className="text-[10px] font-medium tracking-[4px] text-ink/60 uppercase">
              Scroll
            </span>
            <motion.span
              className="h-14 w-[1.5px] origin-top bg-ink/60"
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

const islandSpring = { type: "spring", stiffness: 420, damping: 34 } as const;

// A glass pill at the top center that behaves like the Dynamic Island on an
// iPhone. At rest it is a compact button showing the current section and
// position dots. Hovering (or tapping on touch, or focusing with the keyboard)
// expands it into the full section list, with the active one in a bubble.
// Wide screens only; phones get the tab bar at the bottom.
function SectionIsland({
  sections,
  activeIndex,
  onSelect,
}: {
  sections: FullPageSectionConfig[];
  activeIndex: number;
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const lastPointer = useRef("mouse");
  const previousIndex = useRef(activeIndex);

  // Bounce like an iPhone notification when the section changes at rest.
  useEffect(() => {
    if (previousIndex.current === activeIndex) return;
    previousIndex.current = activeIndex;
    if (!isOpen) {
      animate(scope.current, { scale: [1, 1.08, 1] }, { duration: 0.45, ease: "easeOut" });
    }
  }, [activeIndex, isOpen, animate, scope]);

  // On touch there is no hover to end, so close on an outside tap or Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!scope.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, scope]);

  const handleClick = (id: string) => {
    // Touch users tap the compact island first to open it.
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    onSelect(id);
    if (lastPointer.current !== "mouse") setIsOpen(false);
  };

  return (
    // On phones the tab bar at the bottom follows the sections instead.
    <div className="pointer-events-none fixed inset-x-0 top-2 z-44 flex justify-center transition-opacity duration-300 max-md:hidden">
      <motion.div
        ref={scope}
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.3 }}
        className="pointer-events-auto"
      >
        <motion.nav
          aria-label="Page sections"
          layout
          transition={{ layout: islandSpring }}
          onHoverStart={() => setIsOpen(true)}
          onHoverEnd={() => setIsOpen(false)}
          // Only keyboard focus opens it. A tap also focuses the button on
          // some browsers, and opening there would let the same tap close it.
          onFocus={(event) => {
            if ((event.target as HTMLElement).matches(":focus-visible")) {
              setIsOpen(true);
            }
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsOpen(false);
            }
          }}
          onPointerDownCapture={(event) => {
            lastPointer.current = event.pointerType;
          }}
          style={{ borderRadius: 9999 }}
          className={`glass glass-bar flex items-center ${
            isOpen ? "gap-1 p-1.5" : "gap-0 p-1"
          }`}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {sections.map((section, index) => {
              const isActive = index === activeIndex;
              // At rest only the active section is shown.
              if (!isOpen && !isActive) return null;
              return (
                <motion.button
                  key={section.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.6, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.6, filter: "blur(6px)" }}
                  transition={{
                    layout: islandSpring,
                    default: { duration: 0.25, delay: isOpen ? index * 0.03 : 0 },
                  }}
                  aria-label={
                    isOpen ? `Go to ${section.label} section` : "Show page sections"
                  }
                  aria-current={isActive ? "true" : undefined}
                  aria-expanded={isActive ? isOpen : undefined}
                  onClick={() => handleClick(section.id)}
                  whileTap={{ scale: 0.92 }}
                  style={{ borderRadius: 9999 }}
                  className={`relative flex min-w-10 items-center justify-center gap-2 text-sm font-medium transition-colors duration-300 ${
                    isOpen ? "h-10 px-3" : "h-9 pr-2 pl-3.5"
                  } ${
                    isActive
                      ? isOpen
                        ? "text-canvas"
                        : "text-ink"
                      : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {isActive && isOpen && (
                    <motion.span
                      layoutId="island-active"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={islandSpring}
                      style={{ borderRadius: 9999 }}
                      className="absolute inset-0 bg-ink"
                    />
                  )}
                  <motion.span layout="position" className="relative flex">
                    <FontAwesomeIcon icon={section.icon} className="w-4 text-base" />
                  </motion.span>
                  {isActive && (
                    <motion.span
                      layout="position"
                      className={`relative pr-1 whitespace-nowrap ${
                        isOpen ? "hidden sm:inline" : "inline"
                      }`}
                    >
                      {section.label}
                    </motion.span>
                  )}
                  {isActive && !isOpen && (
                    <motion.span
                      layout="position"
                      aria-hidden
                      className="relative ml-1 flex items-center gap-1"
                    >
                      {sections.map((dot, dotIndex) => (
                        <span
                          key={dot.id}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            dotIndex === activeIndex ? "w-3 bg-ink" : "w-1.5 bg-ink/35"
                          }`}
                        />
                      ))}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.nav>
      </motion.div>
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
      // On phones the bottom padding keeps content clear of the tab bar.
      className="relative flex min-h-dvh w-full snap-start snap-always items-center justify-center overflow-hidden max-md:pb-24"
    >
      {children}
    </section>
  );
}
