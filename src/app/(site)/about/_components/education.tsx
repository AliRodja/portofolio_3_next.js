"use client";

import {
  faAward,
  faChevronDown,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Photo } from "@/components/ui/photo";
import { RichText } from "@/components/ui/rich-text";
import {
  achievements,
  education,
  type AchievementType,
} from "@/data/education";

const INITIAL_COUNT = 4;

const achievementStyles: Record<
  AchievementType,
  { color: string; icon: typeof faMedal }
> = {
  gold: { color: "from-yellow-400 to-orange-500", icon: faMedal },
  silver: { color: "from-slate-400 to-slate-500", icon: faMedal },
  bronze: { color: "from-amber-600 to-yellow-600", icon: faMedal },
  finalist: { color: "from-blue-500 to-purple-600", icon: faAward },
};

export function Education() {
  const [isExpanded, setIsExpanded] = useState(false);
  const visible = isExpanded
    ? achievements
    : achievements.slice(0, INITIAL_COUNT);
  const hiddenCount = achievements.length - INITIAL_COUNT;

  return (
    <motion.section
      className="container mx-auto my-10 p-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
    >
      <div className="mb-12 space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Education
        </h2>
        <p className="mx-auto max-w-[800px] text-gray-600">
          Get to know more about my educational background.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <motion.div
          className="px-5"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="mb-4 text-lg font-medium">
            {education.start} - {education.end}
          </p>
          <h3 className="text-xl font-semibold">{education.school}</h3>
          <p className="mb-3">{education.degree}</p>

          {/* Hovering a photo widens it. */}
          <div className="mb-4 flex h-[250px] gap-4 xl:h-[400px] md:h-[300px]">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="group relative flex-1 overflow-hidden rounded-lg transition-all duration-300 hover:flex-3"
              >
                <Photo
                  src={education.photos[index]}
                  alt={education.school}
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="grayscale transition duration-300 group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4 text-justify font-display text-lg text-gray-600">
            {education.description.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {education.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-2xl bg-gray-300 px-2 py-1 text-black"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col px-5 md:px-0"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="mt-7 text-xl font-semibold">Achievements</h3>
          <p className="mb-3 md:mb-6">Some of my achievements during my study.</p>

          <ul className="space-y-4">
            <AnimatePresence>
              {visible.map((achievement, index) => {
                const style = achievementStyles[achievement.type];
                const isFirstOfYear =
                  visible[index - 1]?.year !== achievement.year;
                return (
                  <motion.li
                    key={`${achievement.event}-${achievement.date}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    {isFirstOfYear && (
                      <div className="mt-2 mb-3 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                          {achievement.year}
                        </span>
                        <span className="h-px flex-1 bg-linear-to-r from-gray-300 to-transparent" />
                      </div>
                    )}
                    <div className="flex items-center gap-4 rounded-2xl border border-white/30 bg-white/20 p-4 shadow-lg grayscale backdrop-blur-md transition duration-300 hover:bg-white/30 hover:shadow-xl hover:grayscale-0">
                      <span
                        className={`flex aspect-square w-10 items-center justify-center rounded-full bg-linear-to-r ${style.color}`}
                      >
                        <FontAwesomeIcon
                          icon={style.icon}
                          className="h-5 w-5 text-white"
                        />
                      </span>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm">{achievement.event}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {achievement.date}
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
                className="flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-6 py-3 text-sm font-medium shadow-lg backdrop-blur-md transition duration-300 hover:bg-white/40 hover:shadow-xl"
              >
                {isExpanded ? "Show Less" : `Show ${hiddenCount} More`}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
