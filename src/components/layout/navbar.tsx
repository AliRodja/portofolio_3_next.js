"use client";

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  type Variants,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { navLinks } from "@/lib/site-config";

const itemVariants: Variants = {
  open: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { type: "tween", duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] },
  }),
  closed: {
    opacity: 0,
    x: -80,
    transition: { type: "tween", duration: 0.2 },
  },
};

// Links to the page you are already on do nothing by default, and a hash that
// is already in the URL does not scroll again. Scroll there by hand instead.
// The home page scrolls inside its own container, marked data-scroll-root.
function scrollWithinPage(event: MouseEvent<HTMLAnchorElement>, href: string) {
  const url = new URL(href, window.location.href);
  if (url.pathname !== window.location.pathname) return;

  event.preventDefault();
  const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  } else {
    const root = document.querySelector("[data-scroll-root]") ?? window;
    root.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.history.replaceState(null, "", url.pathname + url.hash);
}

export function Navbar({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const state = isOpen ? "open" : "closed";

  // The menu grows as a circle from the burger button. The center is set
  // directly when opening (the button sits at a different spot on each
  // breakpoint) and only the radius animates, so the circle never slides.
  const circleX = useMotionValue(0);
  const circleY = useMotionValue(0);
  const radius = useMotionValue(0);
  const clipPath = useMotionTemplate`circle(${radius}px at ${circleX}px ${circleY}px)`;

  const toggle = () => {
    if (!isOpen && burgerRef.current) {
      const rect = burgerRef.current.getBoundingClientRect();
      circleX.set(rect.left + rect.width / 2);
      circleY.set(rect.top + rect.height / 2);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      animate(radius, 0, { duration: 0.3, delay: 0.3, ease: [0.4, 0, 1, 1] });
      return;
    }

    // Far enough to reach the opposite corner of the screen.
    const x = circleX.get();
    const reach = Math.hypot(Math.max(x, window.innerWidth - x), window.innerHeight);
    animate(radius, reach, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });

    // While open: Escape closes it, the page behind does not scroll, and
    // data-menu-open lets other fixed pieces (the home page's island) hide.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    root.dataset.menuOpen = "";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = previousOverflow;
      delete root.dataset.menuOpen;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, circleX, radius]);

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    scrollWithinPage(event, href);
  };

  return (
    <>
      {/* The bar itself is transparent and lets clicks through, so the page
          shows between the two glass pills (and the home page's section
          island can sit between them). */}
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-4 md:px-24">
        <Link
          href="/"
          onClick={(event) => handleLinkClick(event, "/")}
          className={`pointer-events-auto flex h-11 items-center rounded-full px-5 font-display text-xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            isOpen ? "glass-dark glass-dark-hover text-white" : "glass glass-hover text-gray-900 on-dark:text-white"
          }`}
        >
          {name}
        </Link>
        <button
          ref={burgerRef}
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={toggle}
          className={`pointer-events-auto flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 ${
            isOpen ? "glass-dark glass-dark-hover" : "glass glass-hover"
          }`}
        >
          <span
            className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
              isOpen ? "translate-y-[4px] rotate-45 bg-white" : "bg-gray-900 on-dark:bg-white"
            }`}
          />
          <span
            className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
              isOpen ? "-translate-y-[4px] -rotate-45 bg-white" : "bg-gray-900 on-dark:bg-white"
            }`}
          />
        </button>
      </nav>

      <motion.div
        className="fixed inset-0 z-45 flex items-center justify-center bg-[#0a0f4a]/75 backdrop-blur-2xl"
        style={{ clipPath }}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col items-center gap-8">
          <motion.p
            className="font-display text-6xl font-bold text-white/30"
            variants={itemVariants}
            custom={0}
            animate={state}
          >
            Menu
          </motion.p>
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              variants={itemVariants}
              custom={0.1 * (index + 1)}
              animate={state}
            >
              <Link
                href={link.href}
                onClick={(event) => handleLinkClick(event, link.href)}
                tabIndex={isOpen ? 0 : -1}
                className="font-display text-3xl font-bold text-white transition hover:text-white/60"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
