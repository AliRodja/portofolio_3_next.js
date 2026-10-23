export const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Volunteer",
  // Roles in student or community organizations.
  "Organization",
] as const;

export type EmploymentType = (typeof employmentTypes)[number];
