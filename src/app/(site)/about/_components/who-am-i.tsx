import { Reveal } from "@/components/motion/reveal";
import { SectionTitle } from "@/components/sections/section-title";
import { monoPhotoClass, Photo } from "@/components/ui/photo";
import { RichText } from "@/components/ui/rich-text";
import { getProfile } from "@/db/queries/profile";

// Three overlapping photos, positioned like a collage.
const collage = [
  { position: "top-28 left-10 w-[50%]", from: "right", delay: 0 },
  { position: "top-16 right-28 w-[30%]", from: "left", delay: 0.3 },
  { position: "bottom-16 right-20 w-[40%]", from: "left", delay: 0.5 },
] as const;

export async function WhoAmI() {
  const profile = await getProfile();

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
              // The hovered photo comes to the front of the stack.
              className={`group absolute aspect-square transition-[scale] duration-300 hover:z-20 hover:scale-105 ${item.position}`}
            >
              <div className="relative h-full w-full overflow-hidden shadow-lg">
                <Photo
                  src={profile.collagePhotos[index]}
                  alt={profile.fullName}
                  sizes="(max-width: 768px) 80vw, 40vw"
                  className={monoPhotoClass}
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
            {profile.fullName}
          </h3>
          <div className="space-y-5 text-justify font-display text-lg leading-relaxed text-ink/70">
            {profile.about.map((paragraph) => (
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
