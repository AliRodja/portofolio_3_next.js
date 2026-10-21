import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const variants: Record<Variant, string> = {
  primary:
    "border-transparent bg-gray-700 text-gray-100 hover:border-gray-700 hover:bg-transparent hover:text-gray-700",
  secondary:
    "border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-gray-100",
};

export function buttonClass(variant: Variant = "primary") {
  return `inline-block rounded-2xl border-2 px-8 py-2 font-display shadow-md transition duration-300 ease-in-out ${variants[variant]}`;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${buttonClass(variant)} ${className}`} {...props} />;
}
