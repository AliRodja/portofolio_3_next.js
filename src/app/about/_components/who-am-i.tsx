import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";
import { SectionTitle } from "@/components/section-title";
import { site } from "@/data/site";

// Three overlapping photos, positioned like a collage.
const collage = [
  { position: "top-28 left-10 w-[50%]", from: "right", delay: 0 },
  { position: "top-16 right-28 w-[30%]", from: "left", delay: 0.3 },
  { position: "bottom-16 right-20 w-[40%]", from: "left", delay: 0.5 },
] as const;

export function WhoAmI() {
  return (
    <section id="content">
      <SectionTitle title="Who Am I?" />
      <div className="container mx-auto mb-10 grid grid-cols-1 gap-4 px-10 md:grid-cols-2">
        <div className="relative aspect-square w-full">
          {collage.map((item, index) => (
            <Reveal
              key={item.position}
              from={item.from}
              delay={item.delay}
              className={`absolute aspect-square ${item.position}`}
            >
              <div className="relative h-full w-full overflow-hidden grayscale transition duration-300 hover:grayscale-0">
                <Photo
                  src={site.photos.collage[index]}
                  alt={site.fullName}
                  sizes="(max-width: 768px) 80vw, 40vw"
                />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          from="right"
          distance={200}
          delay={0.5}
          className="mb-5 flex flex-col justify-center md:px-10"
        >
          <h3 className="mb-3 text-2xl font-bold tracking-wider">
            {site.fullName}
          </h3>
          <div className="space-y-5 text-justify font-display text-lg leading-relaxed text-gray-600">
            {site.about.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
