import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { TechList } from "@/components/tech-list";
import { education } from "@/data/education";
import { experiences } from "@/data/experience";
import { site } from "@/data/site";
import { skillGroups } from "@/data/skills";

export const metadata: Metadata = {
  title: "About",
  description: `Background, skills, and experience of ${site.fullName}.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading as="h1" eyebrow="About" title={site.fullName} />
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
            {site.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20">
        <Container>
          <SectionHeading eyebrow="Skills" title="What I work with" />
          <div className="grid gap-6 md:grid-cols-3">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="mb-4 font-display text-lg font-semibold">
                  {group.title}
                </h3>
                <TechList items={group.items} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20">
        <Container>
          <SectionHeading eyebrow="Experience" title="Where I have worked" />
          <ol className="relative space-y-10 border-l border-border pl-8">
            {experiences.map((item) => (
              <li key={`${item.company}-${item.start}`} className="relative">
                <span className="absolute top-1.5 -left-[2.4rem] h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
                <p className="text-sm text-muted">
                  {item.start} – {item.end} · {item.location}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold">
                  {item.role}
                </h3>
                <p className="text-muted">
                  {item.company} · {item.type}
                </p>
                <p className="mt-3 max-w-2xl leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4">
                  <TechList items={item.skills} />
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-border py-20">
        <Container>
          <SectionHeading eyebrow="Education" title="Where I studied" />
          <div className="space-y-6">
            {education.map((item) => (
              <div
                key={item.school}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-sm text-muted">
                  {item.start} – {item.end}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold">
                  {item.school}
                </h3>
                <p className="text-muted">{item.degree}</p>
                {item.description && (
                  <p className="mt-3 leading-relaxed">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
