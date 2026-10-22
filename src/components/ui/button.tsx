import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "glass" | "glassDark";

const variants: Record<Variant, string> = {
  primary:
    "rounded-2xl border-2 border-transparent bg-gray-700 text-gray-100 shadow-md hover:border-gray-700 hover:bg-transparent hover:text-gray-700",
  secondary:
    "rounded-2xl border-2 border-gray-700 text-gray-700 shadow-md hover:bg-gray-700 hover:text-gray-100",
  glass:
    "glass glass-hover rounded-full text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
  glassDark:
    "glass-dark glass-dark-hover rounded-full text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
};

export function buttonClass(variant: Variant = "primary") {
  return `inline-block px-8 py-2 font-display transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${variants[variant]}`;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${buttonClass(variant)} ${className}`} {...props} />;
}

