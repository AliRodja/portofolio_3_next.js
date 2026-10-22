export const projectCategories = {
  web: "Web Development",
  ai: "AI & Machine Learning",
  mobile: "Mobile",
  other: "Other",
} as const;

export type ProjectCategory = keyof typeof projectCategories;

export const projectCategoryKeys = Object.keys(projectCategories) as [
  ProjectCategory,
  ...ProjectCategory[],
];
