import type { Metadata } from "next";
import { BackButton } from "@/components/layout/back-button";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { SectionTitle } from "@/components/sections/section-title";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { getProfile } from "@/db/queries/profile";
import { getProjects } from "@/db/queries/projects";
import { ProjectGrid } from "./_components/project-grid";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects I have built and am currently working on.",
};

// Three overlapping screenshots of the highlighted project.
const collage = [
  { position: "top-28 left-10 h-[40%] z-10", from: "right", delay: 0 },
  { position: "top-10 right-28 h-[30%]", from: "left", delay: 0.3 },
  { position: "bottom-10 right-20 h-[35%]", from: "left", delay: 0.5 },
] as const;

export default async function ProjectsPage() {
  const [projects, profile] = await Promise.all([getProjects(), getProfile()]);
  const highlight = projects.find((project) => project.highlight);
  const otherProjects = projects.filter((project) => !project.highlight);

  return (
    <main className="overflow-hidden">
      <BackButton href="/#projects" />
      <PageHero
        title="My Projects"
        description="List of projects that I have done and am currently working on."
        photo={profile.projectsPhoto}
        photoAlt="Projects"
        scrollTargetId="content"
      />

      <div id="content">
        {highlight && (
          <section>
            <SectionTitle title="Highlight" />
            <div className="container mx-auto mb-10 grid grid-cols-1 gap-4 px-10 md:grid-cols-2">
              <div className="relative aspect-square w-full">
                {collage.map((item, index) => (
                  <Reveal
                    key={item.position}
                    from={item.from}
                    delay={item.delay}
                    className={`absolute aspect-video transition duration-300 hover:scale-150 ${item.position}`}
                  >
                    <div className="relative h-full w-full overflow-hidden shadow-lg grayscale transition duration-300 hover:grayscale-0">
                      <Photo
                        src={
                          highlight.images[index] ??
                          (index === 0 ? highlight.thumbnail : null)
                        }
                        alt={highlight.title}
                        sizes="40vw"
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
                  {highlight.title}
                </h3>
                <p className="text-justify font-display text-lg text-white/70">
                  {highlight.description[0]}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <ButtonLink
                    href={`/projects/${highlight.slug}`}
                    variant="glassDark"
                  >
                    More
                  </ButtonLink>
                  {highlight.previewUrl && (
                    <ButtonLink
                      href={highlight.previewUrl}
                      variant="glass"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Preview
                    </ButtonLink>
                  )}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        <SectionTitle title="Other Noteworthy Projects" />
        <ProjectGrid projects={otherProjects} />

        <Reveal from="none" className="my-5 flex justify-center">
          <ButtonLink href="/projects/archive" variant="glassDark">
            View In Archive
          </ButtonLink>
        </Reveal>
      </div>
    </main>
  );
}
