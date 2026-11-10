export const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Volunteer",
  "Organization",
] as const;

export type EmploymentType = (typeof employmentTypes)[number];
