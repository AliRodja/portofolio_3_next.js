"use client";

import {
  faEnvelope,
  faFolderOpen,
  faHouse,
  faUser,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { navLinks } from "@/lib/site-config";
import { useCurrentSection } from "./current-place";
import { scrollWithinPage } from "./scroll-within-page";

// Each tab's icon, and the home page section it stands for.
const tabs: Record<string, { icon: IconDefinition; section: string }> = {
  "/": { icon: faHouse, section: "home" },
  "/about": { icon: faUser, section: "about" },
  "/projects": { icon: faFolderOpen, section: "projects" },
  "/#contact": { icon: faEnvelope, section: "contact" },
};

const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

type Item = {
  key: string;
  label: string;
  href: string;
  icon: IconDefinition;
  current: boolean;
  onHome: boolean;
};

// The main links, Home, About, Projects, and Contact, in two places:
//
// - On phones, a glass tab bar at the bottom of the screen, like the one in
//   the Instagram app, in easy reach of a thumb.
// - On wide screens, a glass pill at the top center of every page except
//   the home page, where the Dynamic Island already lists the same four.
//
// The home page has a section for each link, so there the current tab
// follows the section on screen and a tab scrolls to its section. Elsewhere
// the links open their pages.
export function TabBar() {
  return (
    // The current path is only known per request on some routes, so the
    // static shell renders the phone bar without a current tab.
    <Suspense fallback={<PhoneBar items={buildItems()} />}>
      <ActiveTabBar />
    </Suspense>
  );
}

function ActiveTabBar() {
  const pathname = usePathname();
  const section = useCurrentSection();
  const items = buildItems(pathname, pathname === "/" ? section : null);
  return (
    <>
      <PhoneBar items={items} />
      {pathname !== "/" && <PageIsland items={items} />}
    </>
  );
}

function buildItems(pathname?: string, section?: string | null): Item[] {
  const onHome = Boolean(section);
  return navLinks.map((link) => {
    const tab = tabs[link.href];
    return {
      key: link.href,
      label: link.label,
      icon: tab.icon,
      onHome,
      href: onHome ? (tab.section === "home" ? "/" : `/#${tab.section}`) : link.href,
      current: onHome
        ? tab.section === section
        : pathname !== undefined &&
          !link.href.includes("#") &&
          link.href !== "/" &&
          pathname.startsWith(link.href),
    };
  });
}

function TabLink({
  item,
  bubbleId,
  className,
  children,
}: {
  item: Item;
  bubbleId: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={item.href}
      onClick={(event) => scrollWithinPage(event, item.href)}
      aria-current={item.current ? (item.onHome ? "location" : "page") : undefined}
      className={`relative flex items-center justify-center rounded-full font-medium transition-colors duration-300 active:scale-95 ${
        item.current ? "text-canvas" : "text-ink/60 hover:text-ink"
      } ${className}`}
    >
      {item.current && (
        <motion.span
          layoutId={bubbleId}
          transition={spring}
          style={{ borderRadius: 9999 }}
          className="absolute inset-0 bg-ink"
        />
      )}
      {children}
    </Link>
  );
}

function PhoneBar({ items }: { items: Item[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-44 flex justify-center px-4 md:hidden">
      <nav
        aria-label="Main"
        className="glass glass-bar pointer-events-auto flex w-full max-w-sm items-center justify-between rounded-full p-1.5"
      >
        {items.map((item) => (
          <TabLink
            key={item.key}
            item={item}
            bubbleId="tab-bar-current"
            className="h-13 flex-1 flex-col gap-1 text-[10px] tracking-wide"
          >
            <FontAwesomeIcon icon={item.icon} className="relative text-base" />
            <span className="relative">{item.label}</span>
          </TabLink>
        ))}
      </nav>
    </div>
  );
}

function PageIsland({ items }: { items: Item[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-44 flex justify-center max-md:hidden">
      <nav
        aria-label="Pages"
        className="glass glass-bar pointer-events-auto flex items-center gap-1 rounded-full p-1.5"
      >
        {items.map((item) => (
          <TabLink
            key={item.key}
            item={item}
            bubbleId="page-island-current"
            className="h-10 gap-2 px-4 text-sm"
          >
            <FontAwesomeIcon icon={item.icon} className="relative w-4 text-base" />
            <span className="relative">{item.label}</span>
          </TabLink>
        ))}
      </nav>
    </div>
  );
}
