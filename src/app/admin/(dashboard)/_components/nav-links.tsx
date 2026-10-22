"use client";

import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [{ label: "Projects", href: "/admin/projects", icon: faFolderOpen }];

export function NavLinks({ pathname }: { pathname?: string }) {
  return (
    <ul className="flex gap-2 md:flex-col">
      {links.map((link) => {
        const isActive = pathname?.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                isActive ? "bg-gray-700 text-white" : "hover:bg-gray-800"
              }`}
            >
              <FontAwesomeIcon icon={link.icon} className="w-4" />
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ActiveNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}
