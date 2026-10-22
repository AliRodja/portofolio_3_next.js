"use client";

import { motion } from "motion/react";
import { DoubleBar } from "@/components/motion/double-bar";
import { buttonClass } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";

// Full-screen header for the About and Projects pages: a photo that zooms in
// on load, a large title, and a button that scrolls to the content below.
export function PageHero({
  title,
  description,
  photo,
  photoAlt,
  scrollTargetId,
}: {
  title: string;
  description: string;
  photo?: string;
  photoAlt: string;
  scrollTargetId: string;
}) {
  return (
    <div className="relative mb-10 flex h-screen flex-col items-center justify-center gap-4 overflow-hidden p-10">
      <div className="z-0 mb-48 md:absolute md:top-1/4 md:right-[10%] md:mb-0 md:-translate-y-16">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.6 }}
          transition={{ ease: "circOut", duration: 1 }}
          className="relative h-[400px] w-[80vw] overflow-hidden rounded-sm bg-slate-300 grayscale transition hover:grayscale-0 md:h-[600px] md:w-[30vw]"
        >
          <Photo
            src={photo}
            alt={photoAlt}
            sizes="(max-width: 768px) 80vw, 30vw"
            priority
          />
        </motion.div>
      </div>

      <div className="absolute top-[60%] z-10 flex w-full flex-col items-start bg-gray-100/50 px-10 pt-4 backdrop-blur-sm md:top-1/3 md:left-[10%] md:w-auto md:bg-transparent md:pt-0 md:backdrop-blur-none">
        <h1 className="text-5xl font-bold text-black md:text-8xl">{title}</h1>
        <DoubleBar />
        <p className="mt-4 mb-5 font-display text-xl leading-[1.7rem] tracking-wider text-gray-900">
          {description}
        </p>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          onClick={() =>
            document
              .getElementById(scrollTargetId)
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className={`mb-3 ${buttonClass("primary")}`}
        >
          Scroll Down
        </motion.button>
      </div>
    </div>
  );
}
