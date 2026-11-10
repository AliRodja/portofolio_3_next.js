import type { ReactNode } from "react";
import { DoubleBar } from "@/components/motion/double-bar";
import { Reveal } from "@/components/motion/reveal";
import { FullPageSection } from "@/components/sections/fullpage";
import { monoPhotoClass, Photo } from "@/components/ui/photo";

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
      <div className="relative flex w-full flex-col items-center justify-center gap-6 px-6 py-16 md:h-screen md:p-10">
        <div className="z-0 md:absolute md:top-1/2 md:right-[10%] md:-translate-y-1/2">
          <Reveal from="right" distance={300} delay={0.5}>
            <div className="group relative h-[260px] w-[82vw] overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/20 sm:h-[340px] md:h-[60vh] md:w-[30vw]">
              <Photo
                src={photo}
                alt={photoAlt}
                sizes="(max-width: 768px) 82vw, 30vw"
                className={monoPhotoClass}
              />
            </div>
          </Reveal>
        </div>

        <div className="z-10 flex w-full max-w-[82vw] flex-col items-start md:absolute md:top-1/3 md:left-[10%] md:w-auto md:max-w-xl">
          <Reveal delay={0.1}>
            <h2 className="rounded-xl bg-canvas/20 px-3 text-4xl font-bold text-ink backdrop-blur-sm sm:text-5xl md:px-0 md:text-8xl lg:bg-transparent lg:backdrop-blur-none">
              {title}
            </h2>
          </Reveal>
          <DoubleBar />
          <Reveal delay={0.2}>
            <p className="mb-5 font-display text-lg leading-[1.7rem] tracking-wider text-ink/75 md:text-xl">
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
