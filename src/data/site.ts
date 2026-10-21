type SocialLink = {
  label: string;
  href: string;
};

type SiteConfig = {
  name: string;
  fullName: string;
  role: string;
  intro: string;
  about: string[];
  description: string;
  url: string;
  email: string;
  location: string;
  cvUrl?: string;
  socials: SocialLink[];
};

export const site: SiteConfig = {
  name: "Ali",
  fullName: "Ali Imran Rodja",
  role: "Software Engineer",
  intro:
    "I build fast, accessible web applications with Next.js and TypeScript. Replace this text with a short introduction about yourself.",
  about: [
    "Write a few sentences about who you are, what you focus on, and what kind of problems you enjoy solving.",
    "Add a second paragraph about your background, current work, or what you are learning right now.",
  ],
  description:
    "Personal portfolio of Ali Imran Rodja, a software engineer building modern web applications.",
  url: "https://example.com",
  email: "hello@example.com",
  location: "Indonesia",
  // Put the file in public/docs/cv.pdf, then set this to "/docs/cv.pdf".
  cvUrl: undefined,
  socials: [
    { label: "GitHub", href: "https://github.com/your-username" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-username" },
  ],
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];
