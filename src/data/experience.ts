export type Experience = {
  role: string;
  company: string;
  type: string;
  location: string;
  start: string;
  end: string;
  description: string;
  skills: string[];
};

// Newest first.
export const experiences: Experience[] = [
  {
    role: "Software Engineer",
    company: "Company Name",
    type: "Full-time",
    location: "Indonesia",
    start: "Jan 2025",
    end: "Present",
    description:
      "Placeholder. Describe what you built, the impact it had, and the technologies you used.",
    skills: ["Next.js", "TypeScript"],
  },
];
