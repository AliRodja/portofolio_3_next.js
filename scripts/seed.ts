import { db } from "@/db";
import {
  educations,
  experiences,
  type NewEducation,
  type NewExperience,
  type NewProject,
  type NewSkillCategory,
  profile,
  projects,
  skillCategories,
} from "@/db/schema";
import { defaultProfile } from "@/lib/default-profile";

// Starting content for an empty database, taken from Ali's CV. Safe to run
// again: projects with an existing slug are skipped, and the other sections
// are only filled while their table is empty, so edits made in the dashboard
// are never overwritten. Photos and the CV file are uploads, so add them from
// the dashboard.

const seedProjects: NewProject[] = [
  {
    slug: "inventory-management-system",
    title: "Inventory Management Information System",
    summary:
      "My undergraduate thesis: a web-based asset management system for the Informatics Engineering Study Program at UNPAS.",
    description: [
      "A web-based asset management system for the Informatics Engineering Study Program at Universitas Pasundan, replacing manual processes with an integrated digital system. Built as my undergraduate thesis (2025 – 2026), where I worked as the full-stack developer.",
      "It groups assets by room, codes new items automatically, and handles borrowing with PDF e-letters and photo-based return verification. Assets are tracked with barcodes, and periodic reports are generated automatically.",
    ],
    year: 2026,
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "PostgreSQL"],
    categories: ["web"],
    highlight: true,
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    summary:
      "This website: my portfolio with a liquid glass design and a custom dashboard for managing every section.",
    description: [
      "My personal portfolio. Every section, from projects to education, is managed from a custom dashboard with GitHub login, so updating it never needs a code change.",
      "Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion, Drizzle ORM, and PostgreSQL, with a WebGL liquid glass effect.",
    ],
    year: 2026,
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "PostgreSQL"],
    categories: ["web"],
    sourceUrl: "https://github.com/AliRodja/portofolio_3_next.js",
  },
  {
    slug: "skillconnect",
    title: "SkillConnect",
    summary:
      "A platform connecting users with service providers, where my team built the Midtrans payment gateway module.",
    description: [
      "A platform that connects users with service providers, such as report writing services. Built in the Software Engineering Project (PPL) course in 2025.",
      "The class was split into 8 module-based teams. My team was responsible for the payment gateway module using Midtrans, and I worked as the data analyst.",
    ],
    year: 2025,
    tech: ["React", "Laravel", "Midtrans"],
    categories: ["web"],
  },
  {
    slug: "dashboard-management-system",
    title: "Dashboard Management System",
    summary:
      "The dashboard interface for a multi-team Java application, designed in Figma before implementation.",
    description: [
      "A collaborative project in the Programming Practicum II course (2025) that combined several teams into one application.",
      "As the UI/UX designer, I designed the dashboard management interface in Figma before it was implemented in the Java-based application.",
    ],
    year: 2025,
    tech: ["Figma", "Java"],
    categories: ["other"],
  },
  {
    slug: "shooter-game",
    title: "Shooter Game",
    summary:
      "A shooter-themed game built in Unity, where I led the team and developed the core gameplay mechanics.",
    description: [
      "A shooter-themed game made in the Game Practicum course (2025).",
      "I led the team and developed the core gameplay mechanics, while other team members handled the visual assets and character art.",
    ],
    year: 2025,
    tech: ["Unity", "C#"],
    categories: ["other"],
  },
  {
    slug: "e-waste-mobile-app",
    title: "E-Waste Mobile Application",
    summary:
      "A mobile app for electronic waste, where I led the team designing its core flow from August 2024 to January 2025.",
    description: [
      "As team leader, I led and coordinated a cross-functional team in designing and developing the core flow of the E-Waste application, including authentication (login and register) and profile management.",
      "I was responsible for task allocation, overseeing the project schedule, and making sure the team met its targets.",
    ],
    year: 2025,
    tech: ["Figma", "Microsoft Word", "ClickUp"],
    categories: ["mobile"],
  },
  {
    slug: "bookrn",
    title: "BookRN",
    summary:
      "A concert ticket booking website with a booking system, API integration, and a payment gateway.",
    description: [
      "A concert ticket booking website built as a team project in the Web Practicum course (2024), covering the booking system, API integration, and payment gateway.",
      "I was primarily responsible for the backend, with additional contributions to the frontend.",
    ],
    year: 2024,
    tech: ["Laravel", "Blade", "Tailwind CSS"],
    categories: ["web"],
  },
  {
    slug: "always-healthy",
    title: "Always Healthy",
    summary:
      "A dynamic medicine e-commerce website with login, registration, and full CRUD functionality.",
    description: [
      "A dynamic medicine e-commerce website with login, registration, and full CRUD functionality, built in the Web Programming course (2023) as the full-stack developer.",
    ],
    year: 2023,
    tech: ["Native PHP"],
    categories: ["web"],
  },
  {
    slug: "arei-company-profile",
    title: "AREI Company Profile",
    summary: "A static company profile website.",
    description: [
      "A static company profile website built in the Internet Web Technology course (2022).",
    ],
    year: 2022,
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    categories: ["web"],
  },
  {
    slug: "portfolio-website-2022",
    title: "Portfolio Website (2022)",
    summary: "My first personal portfolio, a static website.",
    description: [
      "A static personal portfolio website built in the Internet Web Technology course (2022).",
    ],
    year: 2022,
    tech: ["HTML", "CSS", "JavaScript"],
    categories: ["web"],
  },
];

const seedExperiences: NewExperience[] = [
  {
    role: "General Chairman",
    company: "HMTIF-UNPAS",
    type: "Organization",
    location: "Bandung, Indonesia",
    startDate: "2025-06-01",
    endDate: "2026-06-01",
    description: [
      "Held overall leadership of the Informatics Engineering student association and set its general policy.",
      "Served as the highest decision-maker after receiving input and recommendations from the board on issues within the study program, with full accountability for all HMTIF-UNPAS programs and activities during the term.",
    ],
    skills: ["Team Leadership", "Decision Making", "Stakeholder Communication"],
  },
  {
    role: "Web Developer Intern",
    company: "PT Afarco Solusi Teknologi",
    type: "Internship",
    location: "Indonesia",
    startDate: "2025-06-01",
    endDate: "2025-08-01",
    description: [
      "Developed and maintained 2 client websites on WordPress, including layout, content, and functionality customization based on client needs.",
      "Coordinated with the team to make sure the websites met quality standards and deadlines.",
    ],
    skills: ["WordPress", "Web Development"],
  },
  {
    role: "Coordinator, Social & Political Division",
    company: "HMTIF-UNPAS",
    type: "Organization",
    location: "Bandung, Indonesia",
    startDate: "2024-09-01",
    endDate: "2025-06-01",
    description: [
      "Organized social and community-oriented activities, and gathered input and aspirations from Informatics Engineering students at UNPAS.",
      "Advocated for and supported students on academic matters.",
    ],
    skills: ["Public Speaking & Advocacy", "Cross-Functional Collaboration"],
  },
];

const seedSkillCategories: NewSkillCategory[] = [
  {
    title: "Frontend Development",
    description: "Responsive, modern interfaces with React and Next.js",
    icon: "web",
    position: 0,
    languages: [
      { name: "Next.js", highlight: true },
      { name: "React", highlight: true },
      { name: "TypeScript", highlight: true },
      { name: "JavaScript", highlight: false },
      { name: "Tailwind CSS", highlight: true },
      { name: "Bootstrap", highlight: false },
      { name: "HTML", highlight: false },
      { name: "CSS", highlight: false },
    ],
    tools: ["Git", "WordPress"],
  },
  {
    title: "Backend & Database",
    description: "APIs, business logic, and relational databases",
    icon: "backend",
    position: 1,
    languages: [
      { name: "Laravel", highlight: true },
      { name: "PHP", highlight: false },
      { name: "Node.js", highlight: true },
      { name: "Express.js", highlight: false },
      { name: "PostgreSQL", highlight: true },
      { name: "MySQL", highlight: false },
    ],
    tools: ["Midtrans Payment Gateway", "Git"],
  },
  {
    title: "UI/UX Design",
    description: "Interfaces designed in Figma before they are built",
    icon: "design",
    position: 2,
    languages: [
      { name: "Figma", highlight: true },
      { name: "Canva", highlight: false },
    ],
    tools: ["ClickUp", "Microsoft Word"],
  },
  {
    title: "Game & Desktop",
    description: "Gameplay in Unity and Java-based applications",
    icon: "game",
    position: 3,
    languages: [
      { name: "Unity", highlight: false },
      { name: "C#", highlight: false },
      { name: "Java", highlight: false },
    ],
    tools: [],
  },
];

const seedEducations: NewEducation[] = [
  {
    school: "Universitas Pasundan",
    degree: "Bachelor of Engineering (S.T.), Informatics Engineering",
    startYear: 2022,
    endYear: 2026,
    description: [
      "Studied Informatics Engineering, with an undergraduate thesis on a **web-based inventory management system** for the study program.",
      "Active in the student association **HMTIF-UNPAS**, first as Coordinator of the Social & Political Division and then as General Chairman.",
    ],
  },
];

// Inserts rows only while the table is empty, since these sections have no
// natural key to skip duplicates by.
async function seedIfEmpty<T extends Parameters<typeof db.insert>[0]>(
  table: T,
  rows: T["$inferInsert"][],
  label: string,
) {
  if ((await db.$count(table)) > 0) {
    console.log(`${label} already exist.`);
    return;
  }
  await db.insert(table).values(rows);
  console.log(`Seeded ${rows.length} ${label.toLowerCase()}.`);
}

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

  await seedIfEmpty(experiences, seedExperiences, "Experiences");
  await seedIfEmpty(skillCategories, seedSkillCategories, "Skill categories");
  await seedIfEmpty(educations, seedEducations, "Educations");

  await db.$client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
