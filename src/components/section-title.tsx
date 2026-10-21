import { DoubleBar } from "@/components/double-bar";
import { Reveal } from "@/components/reveal";

export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mt-16 flex w-full flex-col items-start pl-10 md:pl-32">
      <div className="my-5 flex flex-col">
        <DoubleBar variant="long" />
        <Reveal from="left" distance={200} delay={0.5}>
          <h2 className="mt-3 text-3xl font-bold">{title}</h2>
        </Reveal>
      </div>
    </div>
  );
}
