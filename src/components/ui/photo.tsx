import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

// Black and white until the nearest `group` ancestor is hovered, then the real
// colors fade in. Pass as Photo's className.
export const monoPhotoClass =
  "grayscale transition-[filter] duration-500 group-hover:grayscale-0";

// Fills its parent, which must be positioned and sized.
// Without a src it shows a placeholder so the layout still looks right.
export function Photo({
  src,
  alt,
  sizes,
  className = "",
  priority,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  // For the large photo at the top of a page: load it right away instead of
  // waiting until it scrolls into view.
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/5 text-ink/50 ${className}`}
      >
        <FontAwesomeIcon icon={faImage} className="text-3xl" />
        <span className="text-xs uppercase tracking-widest">Add photo</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      // Next.js 16 deprecated the priority prop in favor of these.
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      className={`object-cover ${className}`}
    />
  );
}
