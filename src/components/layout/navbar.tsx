"use client";

import Link from "next/link";
import { scrollWithinPage } from "./scroll-within-page";
import { ThemeToggle } from "./theme-toggle";

// The name on the left and the theme toggle on the right. Navigation lives
// in the Dynamic Island and page island at the top center on wide screens,
// and in the tab bar at the bottom on phones.
export function Navbar({ name }: { name: string }) {
  return (
    // The bar itself is transparent and lets clicks through, so the page
    // shows between the two glass pills (and the islands can sit between).
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-4 md:px-24">
      <Link
        href="/"
        onClick={(event) => scrollWithinPage(event, "/")}
        className="glass glass-bar glass-hover pointer-events-auto flex h-11 items-center rounded-full px-5 font-display text-xl text-ink transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
      >
        {name}
      </Link>
      <ThemeToggle />
    </nav>
  );
}
