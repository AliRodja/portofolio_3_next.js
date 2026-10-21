export type SkillIcon = "web" | "backend" | "ai" | "mobile";

export type SkillCategory = {
  title: string;
  description: string;
  icon: SkillIcon;
  // Highlighted items are shown in black with a star.
  languages: { name: string; highlight?: boolean }[];
  tools: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Web Development",
    description: "Building modern, responsive web applications",
    icon: "web",
    languages: [
      { name: "Next.js", highlight: true },
      { name: "React", highlight: true },
      { name: "TypeScript", highlight: true },
      { name: "JavaScript" },
      { name: "Tailwind CSS", highlight: true },
      { name: "HTML" },
      { name: "CSS" },
    ],
    tools: ["Vercel", "Git", "GitHub", "Figma", "Postman"],
  },
  {
    title: "Backend & API",
    description: "Creating robust and scalable backend services",
    icon: "backend",
    languages: [
      { name: "Node.js", highlight: true },
      { name: "Express.js" },
      { name: "PostgreSQL", highlight: true },
      { name: "MySQL" },
    ],
    tools: ["Docker", "Postman", "Swagger"],
  },
  {
    title: "AI & Machine Learning",
    description: "Developing intelligent solutions with ML/AI",
    icon: "ai",
    languages: [{ name: "Python", highlight: true }, { name: "Pandas" }],
    tools: ["Jupyter Notebook", "Google Colab"],
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile app development",
    icon: "mobile",
    languages: [{ name: "Flutter", highlight: true }, { name: "Dart" }],
    tools: ["Android Studio"],
  },
];
