export type SkillGroup = {
  title: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "REST APIs", "PostgreSQL"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Figma", "Vercel"],
  },
];
