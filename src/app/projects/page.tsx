import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ProjectGrid } from "@/components/project-grid";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects I have built and am currently working on.",
};

export default function ProjectsPage() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Projects"
          title="Things I have built"
          description="A collection of projects I have built and am currently working on."
        />
        <ProjectGrid projects={projects} />
      </Container>
    </section>
  );
}
