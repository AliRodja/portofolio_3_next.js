export type SocialIcon =
  | "github"
  | "linkedin"
  | "instagram"
  | "x"
  | "discord";

type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

type SiteConfig = {
  name: string;
  fullName: string;
  role: string;
  intro: string;
  // Wrap words in **double asterisks** to make them bold.
  about: string[];
  description: string;
  url: string;
  email: string;
  location: string;
  cvUrl?: string;
  // Paths inside public/, e.g. "/images/me/hero.jpg". Empty photos show a placeholder.
  photos: {
    hero?: string;
    about?: string;
    projects?: string;
    contact?: string;
    collage: string[];
  };
  socials: SocialLink[];
  quote: [string, string];
};

export const site: SiteConfig = {
  name: "Ali",
  fullName: "Ali Imran Rodja",
  role: "Software Engineer",
  intro:
    "Hi! I'm Ali, a software engineer who builds fast, accessible web applications with Next.js and TypeScript. Replace this text with a short introduction about yourself.",
  about: [
    "I am a **Software Engineer** focused on building modern web applications. Write a few sentences about who you are, what you focus on, and what kind of problems you enjoy solving.",
    "Add a second paragraph about your background, your **current work**, or what you are learning right now.",
  ],
  description:
    "Personal portfolio of Ali Imran Rodja, a software engineer building modern web applications.",
  url: "https://example.com",
  email: "hello@example.com",
  location: "Indonesia",
  // Put the file in public/docs/cv.pdf, then set this to "/docs/cv.pdf".
  cvUrl: undefined,
  photos: {
    hero: undefined,
    about: undefined,
    projects: undefined,
    contact: undefined,
    collage: [],
  },
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/your-username",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/your-username",
      icon: "linkedin",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/your-username",
      icon: "instagram",
    },
  ],
  quote: [
    '"There are no limits to what you can accomplish',
    'except the limits you place on your own thinking."',
  ],
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];
