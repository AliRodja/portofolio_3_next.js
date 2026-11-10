"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SectionTitle } from "@/components/sections/section-title";
import type { SkillCategory } from "@/db/schema";
import { skillIcons } from "@/lib/skill-icons";

export function Skills({ categories }: { categories: SkillCategory[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const selected = categories[selectedIndex] ?? categories[0];

  if (!selected) return null;

  return (
    <section className="py-12">
      <SectionTitle title="Skills & Expertise" />

      <div className="container mx-auto mt-6 grid grid-cols-1 gap-8 px-6 md:px-10 lg:grid-cols-12">
        <div
          role="tablist"
          aria-label="Skill categories"
          className="flex flex-col gap-3 lg:col-span-5"
        >
          {categories.map((category, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`skill-tab-${category.id}`}
                aria-selected={isSelected}
                aria-controls={`skill-panel-${category.id}`}
                onClick={() => setSelectedIndex(index)}
                className={`group flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-ink bg-ink text-canvas shadow-sm"
                    : "surface-card surface-card-hover text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? "bg-canvas/15 text-canvas"
                      : "bg-ink/8 text-ink"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={skillIcons[category.icon].icon}
                    className="h-5 w-5"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-lg font-semibold">
                      {category.title}
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        isSelected ? "text-canvas/75" : "text-ink/60"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span
                    className={`mt-1 block text-sm leading-relaxed ${
                      isSelected ? "text-canvas/80" : "text-ink/70"
                    }`}
                  >
                    {category.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              role="tabpanel"
              id={`skill-panel-${selected.id}`}
              aria-labelledby={`skill-tab-${selected.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="surface-card flex h-full flex-col justify-between gap-8 rounded-2xl p-8"
            >
              <div>
                <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/15 pb-4">
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    {selected.title}: Stack
                  </h3>
                  <span className="text-xs font-medium tracking-wider text-ink/65 uppercase">
                    Solid tags indicate primary focus
                  </span>
                </div>

                <ul className="flex flex-wrap gap-2.5">
                  {selected.languages.map((language) => (
                    <li
                      key={language.name}
                      className={`inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium ${
                        language.highlight
                          ? "bg-ink font-semibold text-canvas"
                          : "border border-ink/20 bg-ink/5 text-ink"
                      }`}
                    >
                      {language.name}
                    </li>
                  ))}
                </ul>
              </div>

              {selected.tools.length > 0 && (
                <div className="border-t border-ink/15 pt-6">
                  <h4 className="mb-4 text-xs font-semibold tracking-[0.15em] text-ink/70 uppercase">
                    Infrastructure &amp; Tools
                  </h4>
                  <ul className="flex flex-wrap gap-2">
                    {selected.tools.map((tool) => (
                      <li
                        key={tool}
                        className="rounded-md border border-ink/20 bg-ink/5 px-3 py-1.5 text-xs font-medium text-ink/85"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
