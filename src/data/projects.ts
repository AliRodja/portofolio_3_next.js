export const projectCategories = {
  web: "Web Development",
  ai: "AI & Machine Learning",
  mobile: "Mobile",
  other: "Other",
} as const;

export type ProjectCategory = keyof typeof projectCategories;

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  year: number;
  tech: string[];
  categories: ProjectCategory[];
  // Shown in the "Highlight" section of the projects page. Mark only one.
  highlight?: boolean;
  // Paths inside public/, e.g. "/images/projects/my-project/cover.png".
  thumbnail?: string;
  images?: string[];
  previewUrl?: string;
  sourceUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    summary:
      "This website. A personal portfolio built with the Next.js App Router, TypeScript, Tailwind CSS, and Motion.",
    description: [
      "A statically generated portfolio where every page and project is driven by typed data files, so adding a project only means adding an entry to src/data/projects.ts.",
      "Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Motion for animations.",
    ],
    year: 2026,
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
    categories: ["web"],
    highlight: true,
    sourceUrl: "https://github.com/your-username/Ali-porto-3-nextJs",
  },
  {
    slug: "example-web-app",
    title: "Example Web App",
    summary:
      "Placeholder project. Replace it with a real project: what it does, who it is for, and your role.",
    description: [
      "Describe the problem this project solves and why you built it.",
      "Explain the interesting technical parts: architecture, challenges, and what you learned.",
    ],
    year: 2025,
    tech: ["React", "Node.js", "PostgreSQL"],
    categories: ["web"],
  },
  {
    slug: "example-ai-project",
    title: "Example AI Project",
    summary:
      "Placeholder project to show the category filter. Replace or delete it.",
    description: ["Describe the project here."],
    year: 2025,
    tech: ["Python", "TensorFlow"],
    categories: ["ai"],
  },
  {
    slug: "example-mobile-app",
    title: "Example Mobile App",
    summary:
      "Placeholder project to show the category filter. Replace or delete it.",
    description: ["Describe the project here."],
    year: 2024,
    tech: ["Flutter", "Firebase"],
    categories: ["mobile"],
  },
];

export const highlightProject = projects.find((project) => project.highlight);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
