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
        <h2 className="bg-linear-to-r from-black to-gray-600 bg-clip-text text-5xl font-bold text-transparent">
          Skills & Expertise
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
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
              className={`flex flex-col items-center gap-4 rounded-2xl border p-6 text-center transition-colors duration-300 ${
                isSelected
                  ? "border-2 border-black bg-white/20 shadow-lg"
                  : "border-gray-300/20 bg-white/10 hover:border-gray-300/30 hover:bg-white/20"
              }`}
            >
              <span
                className={`rounded-xl p-4 ${isSelected ? "bg-white/30" : "bg-white/10"}`}
              >
                <FontAwesomeIcon
                  icon={icons[category.icon]}
                  className="h-8 w-8 text-black"
                />
              </span>
              <span>
                <span className="mb-2 block font-display text-lg font-semibold text-black">
                  {category.title}
                </span>
                <span className="block text-sm leading-relaxed text-gray-600">
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
          <div className="rounded-2xl border border-gray-300/30 bg-white/40 p-8 shadow-sm">
            <h3 className="mb-6 text-center text-2xl font-semibold text-black">
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
                      ? "scale-105 bg-black text-white shadow-md"
                      : "border border-gray-400/40 bg-linear-to-r from-gray-200/60 to-white/40 text-black"
                  }`}
                >
                  {language.highlight && (
                    <span className="animate-pulse text-[10px] text-yellow-400">
                      ✦
                    </span>
                  )}
                  {language.name}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="rounded-2xl border border-gray-300/20 bg-white/20 p-8">
            <h3 className="mb-6 text-center text-xl font-medium tracking-wider text-gray-500 uppercase">
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
                  className="rounded-lg border border-gray-400/20 bg-gray-300/30 px-4 py-1.5 text-xs font-medium text-gray-600"
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
