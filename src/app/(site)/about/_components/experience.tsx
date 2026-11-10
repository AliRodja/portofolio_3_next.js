"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SectionTitle } from "@/components/sections/section-title";
import type { Experience as ExperienceItem } from "@/db/schema";
import { formatMonth } from "@/lib/dates";

const INITIAL_COUNT = 3;

export function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const [showAll, setShowAll] = useState(false);
  const reduceMotion = useReducedMotion();
  const visible = showAll ? experiences : experiences.slice(0, INITIAL_COUNT);

  if (experiences.length === 0) return null;

  return (
    <section>
      <SectionTitle title="Professional Experience" />
      <div className="container mx-auto px-6 py-10">
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="absolute left-0 h-full w-1 bg-linear-to-b from-ink/80 via-ink/30 to-transparent md:left-1/2 md:-translate-x-1/2" />

          <ol className="relative space-y-12 md:space-y-16">
            {visible.map((item, index) => {
              const isRight = index % 2 === 1;
              return (
                <li
                  key={item.id}
                  className="relative md:grid md:grid-cols-2 md:items-start md:gap-12"
                >
                  <span className="absolute top-5 left-0 z-10 h-6 w-6 -translate-x-1/2 rounded-full border-4 border-ink/90 bg-canvas shadow-sm md:top-4 md:left-1/2" />

                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    className={`mb-4 ml-10 flex md:row-start-1 md:ml-0 ${
                      isRight
                        ? "md:col-start-1 md:justify-end"
                        : "md:col-start-2 md:justify-start"
                    }`}
                  >
                    <div className="surface-card flex flex-wrap items-center gap-4 rounded-xl px-6 py-3 text-ink sm:gap-6 sm:px-8">
                      <div className="text-center">
                        <div className="text-sm font-bold">{formatMonth(item.startDate)}</div>
                        <div className="text-xs text-ink/65">Start</div>
                      </div>
                      <div className="h-8 w-px bg-ink/20" />
                      <div className="text-center">
                        <div className="text-sm font-bold">{formatMonth(item.endDate)}</div>
                        <div className="text-xs text-ink/65">End</div>
                      </div>
                      <div className="h-8 w-px bg-ink/20" />
                      <div className="text-center">
                        <div className="text-sm font-medium text-ink/85">
                          {item.location}
                        </div>
                        <div className="text-xs text-ink/65">Location</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className={`ml-10 md:row-start-1 md:ml-0 ${
                      isRight ? "md:col-start-2" : "md:col-start-1"
                    }`}
                  >
                    <div className="surface-card surface-card-hover rounded-2xl p-6 transition duration-300">
                      <h3 className="mb-1 text-xl font-bold text-ink">
                        {item.company}
                      </h3>
                      <p className="mb-4 font-display text-lg font-medium text-ink/85">
                        {item.role}
                        <span className="ml-2 text-sm font-normal text-ink/65">
                          • {item.type}
                        </span>
                      </p>
                      {item.description.map((paragraph, i) => (
                        <p
                          key={i}
                          className="mb-4 text-justify leading-relaxed text-ink/75"
                        >
                          {paragraph}
                        </p>
                      ))}
                      <ul className="flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <li
                            key={skill}
                            className="rounded-md border border-ink/20 bg-ink/8 px-3 py-1 text-sm font-medium text-ink"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ol>

          {experiences.length > INITIAL_COUNT && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="glass-solid glass-solid-hover flex min-h-11 items-center gap-2 rounded-full px-8 py-3 font-medium text-canvas transition duration-300 hover:scale-105"
              >
                {showAll ? "Show Less" : "View More Experience"}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-3 w-3 transition-transform ${showAll ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
