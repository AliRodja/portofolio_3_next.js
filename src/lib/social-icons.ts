export const socialIcons = {
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X (Twitter)",
  discord: "Discord",
} as const;

export type SocialIcon = keyof typeof socialIcons;

export const socialIconKeys = Object.keys(socialIcons) as [
  SocialIcon,
  ...SocialIcon[],
];

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};
