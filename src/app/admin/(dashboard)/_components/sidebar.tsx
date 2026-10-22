import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Suspense } from "react";
import { ActiveNavLinks, NavLinks } from "./nav-links";

export function Sidebar() {
  return (
    <aside className="flex shrink-0 flex-col gap-6 bg-gray-900 p-6 text-gray-300 md:w-60">
      <Link href="/admin" className="text-xl font-bold text-white">
        Dashboard
      </Link>
      <nav>
        {/* The current path is only known at request time, so the static
            shell renders the links without an active state. */}
        <Suspense fallback={<NavLinks />}>
          <ActiveNavLinks />
        </Suspense>
      </nav>
      <Link
        href="/"
        target="_blank"
        className="mt-auto hidden items-center gap-2 text-sm hover:text-white md:flex"
      >
        View site
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
      </Link>
    </aside>
  );
}
