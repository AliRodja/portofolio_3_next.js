"use client";

import {
  faAward,
  faChevronDown,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SectionTitle } from "@/components/sections/section-title";
import { monoPhotoClass, Photo } from "@/components/ui/photo";
import { RichText } from "@/components/ui/rich-text";
import type { Achievement, Education as EducationItem } from "@/db/schema";
import { formatMonth } from "@/lib/dates";
import { achievementTypes, formatYears, type AchievementType } from "@/lib/education";

const INITIAL_COUNT = 4;

const achievementIcons: Record<AchievementType, typeof faMedal> = {
  gold: faMedal,
  silver: faMedal,
  bronze: faMedal,
  finalist: faAward,
};

export function Education({
  educations,
  achievements,
}: {
  educations: EducationItem[];
  achievements: Achievement[];
}) {
  const reduceMotion = useReducedMotion();
  if (educations.length === 0 && achievements.length === 0) return null;
  const hasBoth = educations.length > 0 && achievements.length > 0;

  return (
    <section className="my-10">
      <SectionTitle title="Education & Honors" />

      <div className="container mx-auto px-6 py-6 md:px-10">
        <div
          className={`grid grid-cols-1 gap-8 ${hasBoth ? "md:grid-cols-2" : "mx-auto max-w-3xl"}`}
        >
          {educations.length > 0 && (
            <motion.div
              className="space-y-12 px-2 md:px-5"
              initial={reduceMotion ? false : { opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {educations.map((education) => (
                <EducationEntry key={education.id} education={education} />
              ))}
            </motion.div>
          )}

          {achievements.length > 0 && (
            <motion.div
              className="flex flex-col px-2 md:px-0"
              initial={reduceMotion ? false : { opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Achievements achievements={achievements} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function EducationEntry({ education }: { education: EducationItem }) {
  return (
    <div>
      <p className="mb-2 font-mono text-sm font-medium text-ink/70">
        {formatYears(education.startYear, education.endYear)}
      </p>
      <h3 className="text-xl font-semibold text-ink">{education.school}</h3>
      <p className="mb-4 text-ink/80">{education.degree}</p>

      <div className="mb-4 flex h-[250px] gap-4 md:h-[300px] xl:h-[400px]">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="group relative flex-1 overflow-hidden rounded-lg transition-all duration-300 hover:flex-3"
          >
            <Photo
              src={education.photos[index]}
              alt={education.school}
              sizes="(max-width: 768px) 33vw, 20vw"
              className={monoPhotoClass}
            />
          </div>
        ))}
      </div>

      {education.description.length > 0 && (
        <div className="space-y-4 text-justify font-display text-lg text-ink/75">
          {education.description.map((paragraph, index) => (
            <p key={index}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
      )}
      {education.badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {education.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-md border border-ink/20 bg-ink/8 px-3 py-1 font-medium text-ink"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Achievements({ achievements }: { achievements: Achievement[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const visible = isExpanded
    ? achievements
    : achievements.slice(0, INITIAL_COUNT);
  const hiddenCount = achievements.length - INITIAL_COUNT;

  return (
    <>
      <h3 className="text-xl font-semibold text-ink">Achievements</h3>
      <p className="mb-3 text-ink/75 md:mb-6">
        Selected honors and competition awards during my studies.
      </p>

      <ul className="space-y-4">
        <AnimatePresence>
          {visible.map((achievement, index) => {
            const icon = achievementIcons[achievement.type];
            const year = achievement.date.slice(0, 4);
            const isFirstOfYear = visible[index - 1]?.date.slice(0, 4) !== year;
            return (
              <motion.li
                key={achievement.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {isFirstOfYear && (
                  <div className="mt-2 mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/20 bg-ink/8 font-mono text-xs font-bold text-ink">
                      {year}
                    </span>
                    <span className="h-px flex-1 bg-linear-to-r from-ink/30 to-transparent" />
                  </div>
                )}
                <div className="surface-card surface-card-hover flex items-center gap-4 rounded-2xl p-4 transition duration-300">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-canvas"
                  >
                    <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-ink">{achievement.title}</p>
                      <span className="rounded-md border border-ink/20 bg-ink/5 px-2 py-0.5 text-xs font-medium text-ink/80">
                        {achievementTypes[achievement.type]}
                      </span>
                    </div>
                    <p className="text-sm text-ink/80">{achievement.event}</p>
                    <p className="mt-1 text-xs text-ink/65">
                      {formatMonth(achievement.date)}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {hiddenCount > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="glass glass-hover flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition duration-300"
          >
            {isExpanded ? "Show Less" : `Show ${hiddenCount} More`}
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </>
  );
}
