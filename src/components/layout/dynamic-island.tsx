"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAnimate } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { scrollWithinPage } from "./scroll-within-page";

export type IslandItem = {
  key: string;
  label: string;
  icon: IconDefinition;
  href?: string;
};

const EXPAND_TRANSITION =
  "grid-template-columns 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, transform 300ms cubic-bezier(0.22, 1, 0.36, 1), margin 300ms cubic-bezier(0.22, 1, 0.36, 1)";

// Compact top-center navigation pill that expands on hover, tap, or keyboard focus.
export function DynamicIsland({
  items,
  activeIndex,
  onSelect,
  label,
  bubbleId,
}: {
  items: IslandItem[];
  // Pass -1 when no item is active; the collapsed pill rests on the first item.
  activeIndex: number;
  onSelect?: (item: IslandItem) => void;
  label: string;
  // Kept for API compatibility with callers.
  bubbleId?: string;
}) {
  void bubbleId;
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const lastPointer = useRef("mouse");
  const restIndex = Math.max(activeIndex, 0);
  const previousIndex = useRef(restIndex);

  const openIsland = () => {
    setIsTransitioning(true);
    setIsOpen(true);
  };

  const closeIsland = () => {
    setIsTransitioning(true);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen || !isTransitioning) return;
    const timer = window.setTimeout(() => setIsTransitioning(false), 320);
    return () => window.clearTimeout(timer);
  }, [isOpen, isTransitioning]);

  useEffect(() => {
    if (previousIndex.current === restIndex) return;
    previousIndex.current = restIndex;
    if (!isOpen && scope.current) {
      animate(
        scope.current,
        { scale: [1, 1.05, 1] },
        { duration: 0.35, ease: "easeOut" },
      );
    }
  }, [restIndex, isOpen, animate, scope]);

  // On touch there is no hover to end, so close on an outside tap or Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!scope.current?.contains(event.target as Node)) closeIsland();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeIsland();
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, scope]);

  const handleClick = (item: IslandItem, event: MouseEvent<HTMLElement>) => {
    // Touch users tap the compact island first to open it.
    if (!isOpen) {
      event.preventDefault();
      openIsland();
      return;
    }
    if (item.href) {
      scrollWithinPage(event as MouseEvent<HTMLAnchorElement>, item.href);
    } else {
      onSelect?.(item);
    }
    if (lastPointer.current !== "mouse") {
      closeIsland();
    }
  };

  const animateColumns = isOpen || isTransitioning;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-44 flex justify-center max-md:hidden">
      <div ref={scope} className="pointer-events-auto">
        <nav
          aria-label={label}
          onMouseEnter={openIsland}
          onMouseLeave={closeIsland}
          // Guard with :focus-visible so a touch tap does not open on focus and immediately close on click.
          onFocus={(event) => {
            if ((event.target as HTMLElement).matches(":focus-visible")) {
              openIsland();
            }
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              closeIsland();
            }
          }}
          onPointerDownCapture={(event) => {
            lastPointer.current = event.pointerType;
          }}
          className="glass glass-bar flex items-center rounded-full p-1.5"
        >
          {items.map((item, index) => {
            const isRest = index === restIndex;
            const isCurrent = index === activeIndex;
            const isVisible = isOpen || isRest;

            const content = (
              <>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 rounded-full bg-ink transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCurrent
                      ? "scale-100 opacity-100"
                      : "scale-90 opacity-0"
                  }`}
                />
                <span className="relative flex shrink-0 items-center justify-center">
                  <FontAwesomeIcon icon={item.icon} className="w-4 text-base" />
                </span>
                <span className="relative whitespace-nowrap">{item.label}</span>
              </>
            );

            const itemClassName = `relative flex h-9 items-center justify-center gap-2 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-[color,transform] duration-200 ease-out select-none active:scale-95 ${
              isCurrent
                ? "text-canvas"
                : isRest
                  ? "text-ink"
                  : "text-ink/60 hover:text-ink"
            }`;

            return (
              <div
                key={item.key}
                style={{
                  gridTemplateColumns: isVisible ? "1fr" : "0fr",
                  transition: animateColumns ? EXPAND_TRANSITION : "none",
                }}
                className={`grid ${
                  isVisible
                    ? `scale-100 opacity-100 ${isOpen && index > 0 ? "ml-1" : "ml-0"}`
                    : "pointer-events-none ml-0 scale-95 opacity-0"
                }`}
              >
                <div className="flex min-w-0 items-center overflow-hidden">
                  {item.href ? (
                    <Link
                      href={item.href}
                      tabIndex={isVisible ? 0 : -1}
                      aria-label={
                        isOpen ? `Go to ${item.label}` : `Show ${label.toLowerCase()}`
                      }
                      aria-current={isCurrent ? "page" : undefined}
                      aria-expanded={isRest ? isOpen : undefined}
                      onClick={(event) => handleClick(item, event)}
                      className={itemClassName}
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      tabIndex={isVisible ? 0 : -1}
                      aria-label={
                        isOpen ? `Go to ${item.label}` : `Show ${label.toLowerCase()}`
                      }
                      aria-current={isCurrent ? "true" : undefined}
                      aria-expanded={isRest ? isOpen : undefined}
                      onClick={(event) => handleClick(item, event)}
                      className={itemClassName}
                    >
                      {content}
                    </button>
                  )}

                  <span
                    aria-hidden
                    onClick={() => {
                      if (!isOpen) openIsland();
                    }}
                    style={{
                      gridTemplateColumns: isRest && !isOpen ? "1fr" : "0fr",
                      transition: animateColumns ? EXPAND_TRANSITION : "none",
                    }}
                    className={`grid cursor-pointer ${
                      isRest && !isOpen
                        ? "mr-2 ml-2.5 opacity-100"
                        : "pointer-events-none mr-0 ml-0 opacity-0"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-1 overflow-hidden">
                      {items.map((dot, dotIndex) => (
                        <span
                          key={dot.key}
                          className={`h-1.5 shrink-0 rounded-full transition-all duration-300 ${
                            dotIndex === restIndex ? "w-3 bg-ink" : "w-1.5 bg-ink/35"
                          }`}
                        />
                      ))}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
