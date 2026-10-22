// The public URL of the site, used for metadata, the sitemap, and robots.txt.
// BETTER_AUTH_URL already holds it, so there is one less variable to set.
export const siteUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];
