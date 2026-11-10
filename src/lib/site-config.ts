// Reuse BETTER_AUTH_URL as the canonical site URL so only one env var is needed.
export const siteUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];
