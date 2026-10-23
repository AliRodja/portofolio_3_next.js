import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Go back"
      // Beside the name pill on wide screens. Phones keep just the name and
      // the theme toggle at the top, with the tab bar below.
      className="glass glass-bar glass-hover fixed top-2.5 left-10 z-40 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 max-md:hidden"
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-ink" />
    </Link>
  );
}
