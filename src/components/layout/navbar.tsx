"use client";

import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { navLinks, site } from "@/data/site";

// The menu grows as a circle from the burger button in the top-right corner.
const menuVariants: Variants = {
  open: {
    clipPath: "circle(2000px at calc(100% - 40px) 40px)",
    transition: { type: "tween", duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  closed: {
    clipPath: "circle(0px at calc(100% - 40px) 40px)",
    transition: { type: "tween", duration: 0.3, delay: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const state = isOpen ? "open" : "closed";

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-5 backdrop-blur-md transition-colors duration-500 md:px-24 ${
          isOpen ? "bg-gray-700/50" : ""
        }`}
      >
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className={`ml-2 font-display text-2xl transition-colors duration-500 md:ml-0 ${
            isOpen ? "text-white" : ""
          }`}
        >
          {site.name}
        </Link>
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`h-1 w-10 rounded-full transition-all duration-300 ${
              isOpen ? "translate-y-[5px] rotate-45 bg-white" : "bg-black"
            }`}
          />
          <span
            className={`h-1 w-10 rounded-full transition-all duration-300 ${
              isOpen ? "-translate-y-[5px] -rotate-45 bg-white" : "bg-black"
            }`}
          />
        </button>
      </nav>

      <motion.div
        className="fixed inset-0 z-45 flex items-center justify-center bg-gray-700/95"
        variants={menuVariants}
        initial={false}
        animate={state}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col items-center gap-8">
          <motion.p
            className="font-display text-6xl font-bold text-white"
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
                onClick={() => setIsOpen(false)}
                tabIndex={isOpen ? 0 : -1}
                className="font-display text-2xl font-bold text-white hover:text-gray-300"
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
