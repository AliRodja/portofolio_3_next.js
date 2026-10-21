import type { Metadata } from "next";
import { BackButton } from "@/components/back-button";
import { PageHero } from "@/components/page-hero";
import { site } from "@/data/site";
import { Education } from "./_components/education";
import { Experience } from "./_components/experience";
import { Quote } from "./_components/quote";
import { Skills } from "./_components/skills";
import { WhoAmI } from "./_components/who-am-i";

export const metadata: Metadata = {
  title: "About",
  description: `Background, skills, and experience of ${site.fullName}.`,
};

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      <BackButton href="/#about" />
      <PageHero
        title="About Me"
        description="A brief introduction to my journey as a software engineer."
        photo={site.photos.about}
        photoAlt={site.fullName}
        scrollTargetId="content"
      />
      <WhoAmI />
      <Skills />
      <Experience />
      <Education />
      <Quote />
    </main>
  );
}
