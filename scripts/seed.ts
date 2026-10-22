import { db } from "@/db";
import { type NewProject, profile, projects } from "@/db/schema";
import { defaultProfile } from "@/lib/default-profile";

// Starter content for an empty database. Safe to run again: existing slugs are
// skipped, so edits made in the dashboard are never overwritten.
const seedProjects: NewProject[] = [
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
    sourceUrl: "https://github.com/AliRodja/portofolio_3_next.js",
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

async function main() {
  const [seededProfile] = await db
    .insert(profile)
    .values({ id: 1, ...defaultProfile })
    .onConflictDoNothing()
    .returning({ id: profile.id });
  console.log(seededProfile ? "Seeded profile." : "Profile already exists.");

  const inserted = await db
    .insert(projects)
    .values(seedProjects)
    .onConflictDoNothing({ target: projects.slug })
    .returning({ slug: projects.slug });

  console.log(`Seeded ${inserted.length} of ${seedProjects.length} projects.`);
  await db.$client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
