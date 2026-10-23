import type { ProfileData } from "@/db/schema";

// Shown until the profile is saved from the dashboard, and used by the seed
// script for a fresh database. Photos and the CV are uploads, so they are
// added from the dashboard.
export const defaultProfile: ProfileData = {
  name: "Ali",
  fullName: "Ali Imran Rodja",
  role: "Junior Full Stack Web Developer",
  email: "rodjaali@gmail.com",
  intro:
    "I am a Junior Full-Stack Web Developer and UI/UX Designer with a strong foundation in both software engineering and visual design, a combination that allows me to build digital products that are not only functional, but also intuitive and user-centered.",
  about: [
    "What I bring to a team:",
    "End-to-end product thinking from wireframe to working system, Strong communication and organizational skills sharpened through real leadership roles, A learning-first mindset with hands-on experience in live project environments",
  ],
  description:
    "Portfolio of Ali Imran Rodja, a full-stack web developer and UI/UX designer building web applications with Next.js, Laravel, and PostgreSQL.",
  cvUrl: null,
  heroPhoto: null,
  aboutPhoto: null,
  projectsPhoto: null,
  contactPhoto: null,
  collagePhotos: [],
  socials: [
    { label: "GitHub", href: "https://github.com/AliRodja", icon: "github" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aliimrnrdj",
      icon: "linkedin",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/aliimrnrdj_",
      icon: "instagram",
    },
  ],
  quoteLine1: "Building digital solutions while growing as a leader.",
  quoteLine2: "- Ali Imran Rodja -",
};
