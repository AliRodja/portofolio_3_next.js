"use client";

import {
  faArrowUpRightFromSquare,
  faBars,
  faBriefcase,
  faFolderOpen,
  faGauge,
  faGraduationCap,
  faLayerGroup,
  faUser,
  faXmark,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type NavLink = {
  label: string;
  href: string;
  icon: IconDefinition;
  // Only highlight on an exact match, for links whose path prefixes others.
  exact?: boolean;
  // Not built yet. Shown disabled so the full structure is visible.
  soon?: boolean;
};

const groups: { title: string; links: NavLink[] }[] = [
  {
    title: "General",
    links: [
      { label: "Overview", href: "/admin", icon: faGauge, exact: true },
      { label: "Profile", href: "/admin/profile", icon: faUser },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Projects", href: "/admin/projects", icon: faFolderOpen },
      { label: "Experience", href: "/admin/experience", icon: faBriefcase, soon: true },
      { label: "Skills", href: "/admin/skills", icon: faLayerGroup, soon: true },
      { label: "Education", href: "/admin/education", icon: faGraduationCap, soon: true },
    ],
  },
];

// On desktop the sidebar is always visible. On mobile it slides in from the
// left, opened from a top bar.
export function SidebarFrame({
  pathname,
  user,
}: {
  pathname?: string;
  user: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const isActive = (link: NavLink) =>
    pathname !== undefined &&
    (link.exact ? pathname === link.href : pathname.startsWith(link.href));

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <Brand />
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {isOpen && (
        <div
          aria-hidden
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-gray-900/30 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-300 md:sticky md:top-0 md:h-dvh md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Brand />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {groups.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="mb-2 px-3 text-xs font-medium tracking-wider text-gray-400 uppercase">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.soon ? (
                      <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400">
                        <FontAwesomeIcon icon={link.icon} className="w-4" />
                        {link.label}
                        <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                          Soon
                        </span>
                      </span>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={isActive(link) ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          isActive(link)
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <FontAwesomeIcon icon={link.icon} className="w-4" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-gray-200 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-4" />
            View site
          </Link>
          {user}
        </div>
      </aside>
    </>
  );
}

// The current path is only known at request time, so the layout renders
// SidebarFrame without it in the static shell and swaps this in.
export function ActiveSidebar({ user }: { user: ReactNode }) {
  return <SidebarFrame pathname={usePathname()} user={user} />;
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-sm text-white">
        <FontAwesomeIcon icon={faLayerGroup} />
      </span>
      <span className="font-semibold">Dashboard</span>
    </Link>
  );
}
