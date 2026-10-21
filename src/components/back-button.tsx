import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Go back"
      className="fixed top-2 -left-2 z-50 flex items-center justify-center rounded-full p-4 md:left-10"
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-black" />
    </Link>
  );
}
