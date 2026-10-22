import type { ProfileData } from "@/db/schema";

// Shown until the profile is saved from the dashboard, and used by the seed
// script for a fresh database.
export const defaultProfile: ProfileData = {
  name: "Ali",
  fullName: "Ali Imran Rodja",
  role: "Software Engineer",
  email: "hello@example.com",
  intro:
    "Hi! I'm Ali, a software engineer who builds fast, accessible web applications with Next.js and TypeScript. Replace this text with a short introduction about yourself.",
  about: [
    "I am a **Software Engineer** focused on building modern web applications. Write a few sentences about who you are, what you focus on, and what kind of problems you enjoy solving.",
    "Add a second paragraph about your background, your **current work**, or what you are learning right now.",
  ],
  description:
    "Personal portfolio of Ali Imran Rodja, a software engineer building modern web applications.",
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
      href: "https://www.linkedin.com/in/your-username",
      icon: "linkedin",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/your-username",
      icon: "instagram",
    },
  ],
  quoteLine1: '"There are no limits to what you can accomplish',
  quoteLine2: 'except the limits you place on your own thinking."',
};
