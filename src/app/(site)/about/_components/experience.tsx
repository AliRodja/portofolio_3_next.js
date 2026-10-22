"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { useState } from "react";
import { SectionTitle } from "@/components/sections/section-title";
import { experiences } from "@/data/experience";

const INITIAL_COUNT = 3;

export function Experience() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? experiences : experiences.slice(0, INITIAL_COUNT);

  return (
    <section>
      <SectionTitle title="Professional Experience" />
      <div className="container mx-auto px-6 py-10">
        <div className="relative mx-auto w-full max-w-6xl">
          {/* Timeline line: on the left on mobile, centered on desktop. */}
          <div className="absolute left-0 h-full w-1 bg-linear-to-b from-black via-gray-400 to-transparent md:left-1/2 md:-translate-x-1/2" />

          <ol className="relative space-y-12 md:space-y-16">
            {visible.map((item, index) => {
              const isRight = index % 2 === 1;
              return (
                <li
                  key={`${item.company}-${item.start}`}
                  className="relative md:grid md:grid-cols-2 md:items-start md:gap-12"
                >
                  <span className="absolute top-5 left-0 z-10 h-6 w-6 -translate-x-1/2 rounded-full border-4 border-white bg-black shadow-lg md:top-4 md:left-1/2" />

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    className={`mb-4 ml-10 flex md:row-start-1 md:ml-0 ${
                      isRight
                        ? "md:col-start-1 md:justify-end"
                        : "md:col-start-2 md:justify-start"
                    }`}
                  >
                    <div className="flex items-center gap-6 rounded-xl border border-gray-600 bg-linear-to-r from-black to-gray-800 px-8 py-3 text-white shadow-lg">
                      <div className="text-center">
                        <div className="text-sm font-bold">{item.start}</div>
                        <div className="text-xs text-gray-300">Start</div>
                      </div>
                      <div className="h-8 w-px bg-gray-500" />
                      <div className="text-center">
                        <div className="text-sm font-bold">{item.end}</div>
                        <div className="text-xs text-gray-300">End</div>
                      </div>
                      <div className="h-8 w-px bg-gray-500" />
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-400">
                          {item.location}
                        </div>
                        <div className="text-xs text-gray-300">Location</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className={`ml-10 md:row-start-1 md:ml-0 ${
                      isRight ? "md:col-start-2" : "md:col-start-1"
                    }`}
                  >
                    <div className="rounded-2xl border border-gray-300/30 bg-white/20 p-6 shadow-lg backdrop-blur-sm transition duration-300 hover:bg-white/30 hover:shadow-xl">
                      <h3 className="mb-1 text-xl font-bold text-black">
                        {item.company}
                      </h3>
                      <p className="mb-4 font-display text-lg font-medium text-gray-700">
                        {item.role}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          • {item.type}
                        </span>
                      </p>
                      <p className="mb-4 text-justify leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <li
                            key={skill}
                            className="rounded-full border border-gray-400/40 bg-gray-200/60 px-3 py-1 text-sm font-medium text-black transition duration-300 hover:scale-105"
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
                className="flex items-center gap-2 rounded-full bg-black px-8 py-3 font-medium text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-gray-800"
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
