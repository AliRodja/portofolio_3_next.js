// How an achievement placed, which sets its badge on the About page.
export const achievementTypes = {
  gold: "Gold / 1st place",
  silver: "Silver / 2nd place",
  bronze: "Bronze / 3rd place",
  finalist: "Finalist / other award",
} as const;

export type AchievementType = keyof typeof achievementTypes;

export const achievementTypeKeys = Object.keys(achievementTypes) as [
  AchievementType,
  ...AchievementType[],
];

// "2021 – 2025", or "2021 – Present" while still studying.
export function formatYears(start: number, end: number | null) {
  return `${start} – ${end ?? "Present"}`;
}
