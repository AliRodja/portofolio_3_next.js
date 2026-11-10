"use client";

import Link from "next/link";
import { scrollWithinPage } from "./scroll-within-page";
import { ThemeToggle } from "./theme-toggle";

export function Navbar({ name }: { name: string }) {
  return (
    // Let pointer events pass through the bar so the center Dynamic Island remains clickable.
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
