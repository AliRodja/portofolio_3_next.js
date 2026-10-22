import { DoubleBar } from "@/components/motion/double-bar";
import { Reveal } from "@/components/motion/reveal";

export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mt-16 flex w-full flex-col items-start pl-10 md:pl-32">
      <div className="my-5 flex flex-col">
        <DoubleBar variant="long" />
        {/* A short slide: starting fully off screen, a short title like
            "Archive" never counts as in view, so it would never appear. */}
        <Reveal from="left" distance={80} delay={0.5}>
          <h2 className="mt-3 text-3xl font-bold">{title}</h2>
        </Reveal>
      </div>
    </div>
  );
}
