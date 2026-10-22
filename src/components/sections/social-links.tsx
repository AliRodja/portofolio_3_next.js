"use client";

import {
  faDiscord,
  faGithub,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { site, type SocialIcon } from "@/data/site";

const icons = {
  github: faGithub,
  linkedin: faLinkedin,
  instagram: faInstagram,
  x: faXTwitter,
  discord: faDiscord,
} satisfies Record<SocialIcon, unknown>;

export function SocialLinks() {
  const links = [
    { label: "Send email", href: `mailto:${site.email}`, icon: faEnvelope },
    ...site.socials.map((social) => ({
      label: `${social.label} profile`,
      href: social.href,
      icon: icons[social.icon],
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {links.map((link, index) => (
        <motion.a
          key={link.href}
          href={link.href}
          aria-label={link.label}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700 text-gray-100 transition-colors duration-300 hover:bg-gray-400"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * (index + 1) }}
        >
          <FontAwesomeIcon icon={link.icon} className="text-3xl" />
        </motion.a>
      ))}
    </div>
  );
}
