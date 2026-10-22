import type { Metadata } from "next";
import { BackButton } from "@/components/layout/back-button";
import { PageTransition } from "@/components/motion/page-transition";
import { PageHero } from "@/components/sections/page-hero";
import { getExperiences } from "@/db/queries/experience";
import { getProfile } from "@/db/queries/profile";
import { Education } from "./_components/education";
import { Experience } from "./_components/experience";
import { Quote } from "./_components/quote";
import { Skills } from "./_components/skills";
import { WhoAmI } from "./_components/who-am-i";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: "About",
    description: `Background, skills, and experience of ${profile.fullName}.`,
  };
}

export default async function AboutPage() {
  const [profile, experiences] = await Promise.all([
    getProfile(),
    getExperiences(),
  ]);

  return (
    <PageTransition>
      <main className="overflow-hidden">
        <BackButton href="/#about" />
        <PageHero
          title="About Me"
          description="A brief introduction to my journey as a software engineer."
          photo={profile.aboutPhoto}
          photoAlt={profile.fullName}
          scrollTargetId="content"
        />
        <WhoAmI />
        <Skills />
        <Experience experiences={experiences} />
        <Education />
        <Quote lines={[profile.quoteLine1, profile.quoteLine2]} />
      </main>
    </PageTransition>
  );
}
