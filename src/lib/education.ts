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

export function formatYears(start: number, end: number | null) {
  return `${start} – ${end ?? "Present"}`;
}
