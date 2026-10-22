import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Go back"
      // Below the navbar on mobile, beside the logo pill on desktop. z-40
      // keeps it under the menu overlay (z-45).
      className="glass glass-hover fixed top-[4.5rem] left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 md:top-2.5 md:left-10"
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-white" />
    </Link>
  );
}
