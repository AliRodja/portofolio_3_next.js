export type Education = {
  school: string;
  degree: string;
  start: string;
  end: string;
  // Wrap words in **double asterisks** to make them bold.
  description: string[];
  badges: string[];
  // Paths inside public/. Up to three photos are shown.
  photos: string[];
};

export type AchievementType = "gold" | "silver" | "bronze" | "finalist";

export type Achievement = {
  title: string;
  event: string;
  date: string;
  year: number;
  type: AchievementType;
};

export const education: Education = {
  school: "University Name",
  degree: "Bachelor of Computer Science",
  start: "2021",
  end: "2025",
  description: [
    "Placeholder. Describe your study, focus, and **achievements** during university.",
    "Add organizations, communities, or projects you led.",
  ],
  badges: ["GPA: 3.8 out of 4"],
  photos: [],
};

// Newest first.
export const achievements: Achievement[] = [
  {
    title: "1st place (Gold Medal)",
    event: "Example Competition",
    date: "Mar 2025",
    year: 2025,
    type: "gold",
  },
  {
    title: "Finalist",
    event: "Example Hackathon",
    date: "Oct 2024",
    year: 2024,
    type: "finalist",
  },
];
