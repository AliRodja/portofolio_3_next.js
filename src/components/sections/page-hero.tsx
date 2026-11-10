"use client";

import { motion, useReducedMotion } from "motion/react";
import { DoubleBar } from "@/components/motion/double-bar";
import { buttonClass } from "@/components/ui/button";
import { monoPhotoClass, Photo } from "@/components/ui/photo";

export function PageHero({
  title,
  description,
  photo,
  photoAlt,
  scrollTargetId,
}: {
  title: string;
  description: string;
  photo?: string | null;
  photoAlt: string;
  scrollTargetId: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mb-10 flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-6 py-20 md:h-screen md:p-10">
      <div className="z-0 md:absolute md:top-1/4 md:right-[10%] md:-translate-y-16">
        <motion.div
          initial={reduceMotion ? false : { scale: 0.625 }}
          animate={{ scale: 1 }}
          transition={{ ease: "circOut", duration: 1.2 }}
          className="group relative h-[280px] w-[82vw] overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/20 sm:h-[360px] md:h-[600px] md:w-[30vw]"
        >
          <motion.div
            className="absolute inset-0"
            initial={reduceMotion ? false : { scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ ease: "circOut", duration: 1.6 }}
          >
            <Photo
              src={photo}
              alt={photoAlt}
              sizes="(max-width: 768px) 82vw, 30vw"
              priority
              className={monoPhotoClass}
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="z-10 flex w-full max-w-[82vw] flex-col items-start md:absolute md:top-1/3 md:left-[10%] md:w-auto md:max-w-xl">
        <h1 className="text-4xl font-bold text-ink sm:text-5xl md:text-8xl">{title}</h1>
        <DoubleBar />
        <p className="mt-4 mb-5 font-display text-lg leading-[1.7rem] tracking-wider text-ink/80 md:text-xl">
          {description}
        </p>
        <motion.button
          type="button"
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          onClick={() =>
            document
              .getElementById(scrollTargetId)
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className={`mb-3 ${buttonClass("glassSolid")}`}
        >
          Explore Section
        </motion.button>
      </div>
    </div>
  );
}
