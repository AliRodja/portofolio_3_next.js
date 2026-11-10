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
import { DynamicIsland } from "./dynamic-island";
import { scrollWithinPage } from "./scroll-within-page";

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

// Renders the bottom tab bar on mobile and the top Dynamic Island on non-home desktop pages.
export function TabBar() {
  return (
    // Prerender the mobile bar without an active tab while usePathname resolves inside Suspense.
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
    <DynamicIsland
      items={items}
      activeIndex={items.findIndex((item) => item.current)}
      label="Pages"
      bubbleId="page-island-current"
    />
  );
}
