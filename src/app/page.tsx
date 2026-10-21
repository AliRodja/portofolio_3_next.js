import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { featuredProjects } from "@/data/projects";
import { site } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <section className="py-24 md:py-36">
        <Container>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-accent">
            {site.role} · {site.location}
          </p>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
            Hi, I&apos;m {site.name}.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {site.intro}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/projects">View projects</ButtonLink>
            <ButtonLink href="/about" variant="secondary">
              About me
            </ButtonLink>
            {site.cvUrl && (
              <ButtonLink
                href={site.cvUrl}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV
              </ButtonLink>
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20">
        <Container>
          <SectionHeading
            eyebrow="Selected work"
            title="Featured projects"
            description="A few things I have built recently."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/projects" variant="secondary">
              All projects
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section id="contact" className="scroll-mt-16 border-t border-border py-20">
        <Container>
          <SectionHeading
            eyebrow="Contact"
            title="Let's work together"
            description="Have a project in mind or just want to say hi? My inbox is open."
          />
          <a
            href={`mailto:${site.email}`}
            className="font-display text-2xl font-semibold underline decoration-accent decoration-2 underline-offset-8 transition hover:text-accent md:text-4xl"
          >
            {site.email}
          </a>
        </Container>
      </section>
    </>
  );
}
