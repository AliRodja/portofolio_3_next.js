import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

// Fills its parent, which must be positioned and sized.
// Without a src it shows a placeholder so the layout still looks right.
export function Photo({
  src,
  alt,
  sizes,
  className = "",
  priority,
}: {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-400 text-slate-600 ${className}`}
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
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
