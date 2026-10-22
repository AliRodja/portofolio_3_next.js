import type { ReactNode } from "react";
import { DoubleBar } from "@/components/motion/double-bar";
import { Reveal } from "@/components/motion/reveal";
import { FullPageSection } from "@/components/sections/fullpage";
import { monoPhotoClass, Photo } from "@/components/ui/photo";

// Big title on the left, photo sliding in on the right.
export function FeatureSection({
  id,
  title,
  description,
  photo,
  photoAlt,
  children,
}: {
  id: string;
  title: string;
  description: ReactNode;
  photo?: string | null;
  photoAlt: string;
  children: ReactNode;
}) {
  return (
    <FullPageSection id={id}>
      <div className="relative flex w-full flex-col items-center justify-center gap-4 p-10 md:h-screen">
        <div className="z-0 mb-48 md:absolute md:top-1/2 md:right-[10%] md:mb-0 md:-translate-y-1/2">
          <Reveal from="right" distance={300} delay={0.5}>
            <div className="group relative h-[400px] w-[80vw] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/20 md:h-[60vh] md:w-[30vw]">
              <Photo
                src={photo}
                alt={photoAlt}
                sizes="(max-width: 768px) 80vw, 30vw"
                className={monoPhotoClass}
              />
            </div>
          </Reveal>
        </div>

        <div className="absolute top-[60%] z-10 flex w-full flex-col items-start px-10 py-5 md:top-1/3 md:left-[10%] md:w-auto">
          <Reveal delay={0.1}>
            <h2 className="rounded-xl bg-black/20 px-3 text-5xl font-bold text-white backdrop-blur-sm md:px-0 md:text-8xl lg:bg-transparent lg:backdrop-blur-none">
              {title}
            </h2>
          </Reveal>
          <DoubleBar />
          <Reveal delay={0.2}>
            <p className="mb-5 font-display text-xl leading-[1.7rem] tracking-wider text-white/70">
              {description}
            </p>
          </Reveal>
          <Reveal from="up" delay={0.3}>
            {children}
          </Reveal>
        </div>
      </div>
    </FullPageSection>
  );
}
