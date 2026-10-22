"use client";

import {
  faBrain,
  faCode,
  faMobileScreen,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { skillCategories, type SkillIcon } from "@/data/skills";

const icons = {
  web: faCode,
  backend: faServer,
  ai: faBrain,
  mobile: faMobileScreen,
} satisfies Record<SkillIcon, unknown>;

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

const staggerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

export function Skills() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = skillCategories[selectedIndex];

  return (
    <section className="container mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 space-y-4 text-center"
      >
        <h2 className="bg-linear-to-r from-white to-white/60 bg-clip-text text-5xl font-bold text-transparent">
          Skills & Expertise
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/70">
          Click on any category to see the technologies and tools I work with.
        </p>
      </motion.div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((category, index) => {
          const isSelected = index === selectedIndex;
          return (
            <motion.button
              key={category.title}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-pressed={isSelected}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ delay: index * 0.1 }}
              className={`glass flex flex-col items-center gap-4 rounded-2xl p-6 text-center transition-colors duration-300 ${
                isSelected ? "bg-white/20 ring-2 ring-white/70" : "glass-hover"
              }`}
            >
              <span
                className={`rounded-xl p-4 ${isSelected ? "bg-white/25" : "bg-white/10"}`}
              >
                <FontAwesomeIcon
                  icon={icons[category.icon]}
                  className="h-8 w-8 text-white"
                />
              </span>
              <span>
                <span className="mb-2 block font-display text-lg font-semibold text-white">
                  {category.title}
                </span>
                <span className="block text-sm leading-relaxed text-white/60">
                  {category.description}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="mt-12 space-y-8"
        >
          <div className="glass rounded-2xl p-8">
            <h3 className="mb-6 text-center text-2xl font-semibold text-white">
              Technology Stack
            </h3>
            <motion.ul
              className="flex flex-wrap justify-center gap-3"
              variants={staggerVariants}
              initial="hidden"
              animate="show"
            >
              {selected.languages.map((language) => (
                <motion.li
                  key={language.name}
                  variants={tagVariants}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                    language.highlight
                      ? "scale-105 bg-white text-gray-900 shadow-md"
                      : "border border-white/20 bg-white/10 text-white"
                  }`}
                >
                  {language.highlight && (
                    <span className="animate-pulse text-[10px] text-amber-500">
                      ✦
                    </span>
                  )}
                  {language.name}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/8 p-8">
            <h3 className="mb-6 text-center text-xl font-medium tracking-wider text-white/70 uppercase">
              Infrastructure & Tools
            </h3>
            <motion.ul
              className="flex flex-wrap justify-center gap-3"
              variants={staggerVariants}
              initial="hidden"
              animate="show"
            >
              {selected.tools.map((tool) => (
                <motion.li
                  key={tool}
                  variants={tagVariants}
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/85"
                >
                  {tool}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
