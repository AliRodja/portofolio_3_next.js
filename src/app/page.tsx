import {
  faEnvelope,
  faFolderOpen,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/button";
import { DoubleBar } from "@/components/double-bar";
import { FullPage, FullPageSection } from "@/components/fullpage";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/components/social-links";
import { site } from "@/data/site";

const sections = [
  { id: "home", label: "Home", icon: faHouse },
  { id: "about", label: "About", icon: faUser },
  { id: "projects", label: "Projects", icon: faFolderOpen },
  { id: "contact", label: "Contact", icon: faEnvelope },
];

// Big title on the left, photo sliding in on the right.
function FeatureSection({
  id,
  title,
  description,
  photo,
  photoAlt,
  children,
}: {
  id: string;
  title: string;
  description: ReactNode;
  photo?: string;
  photoAlt: string;
  children: ReactNode;
}) {
  return (
    <FullPageSection id={id}>
      <div className="relative flex w-full flex-col items-center justify-center gap-4 p-10 md:h-screen">
        <div className="z-0 mb-48 md:absolute md:top-1/2 md:right-[10%] md:mb-0 md:-translate-y-1/2">
          <Reveal from="right" distance={300} delay={0.5}>
            <div className="relative h-[400px] w-[80vw] overflow-hidden rounded-sm bg-slate-300 grayscale transition duration-300 hover:grayscale-0 md:h-[60vh] md:w-[30vw]">
              <Photo
                src={photo}
                alt={photoAlt}
                sizes="(max-width: 768px) 80vw, 30vw"
              />
            </div>
          </Reveal>
        </div>

        <div className="absolute top-[60%] z-10 flex w-full flex-col items-start px-10 py-5 md:top-1/3 md:left-[10%] md:w-auto">
          <Reveal delay={0.1}>
            <h2 className="bg-white/50 px-3 text-5xl font-bold text-black md:px-0 md:text-8xl lg:bg-transparent">
              {title}
            </h2>
          </Reveal>
          <DoubleBar />
          <Reveal delay={0.2}>
            <p className="mb-5 font-display text-xl leading-[1.7rem] tracking-wider text-gray-500">
              {description}
            </p>
          </Reveal>
          <Reveal from="up" delay={0.3}>
            {children}
          </Reveal>
        </div>
      </div>
    </FullPageSection>
  );
}

export default function HomePage() {
  return (
    <FullPage sections={sections}>
      <FullPageSection id="home">
        <div className="mx-auto grid w-[82%] max-w-screen-2xl grid-cols-1 gap-4 p-10 md:grid-cols-3">
          <div className="col-span-2 flex flex-col items-center justify-center text-center md:items-start md:text-start">
            <Reveal className="mx-auto my-10 md:hidden">
              <div className="relative h-60 w-60 overflow-hidden rounded-full bg-slate-500 grayscale transition duration-300 hover:grayscale-0">
                <Photo
                  src={site.photos.hero}
                  alt={site.fullName}
                  sizes="240px"
                  priority
                />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mb-3 font-display text-xl tracking-[.5rem] text-gray-500 uppercase">
                {site.fullName}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <h1 className="my-2 text-4xl font-bold text-black md:my-5 md:text-6xl 2xl:text-8xl">
                {site.role}
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="mt-4 font-display text-base leading-[1.7rem] tracking-wider text-gray-500 2xl:text-xl">
                {site.intro}
              </p>
            </Reveal>
            <Reveal delay={0.5} className="mt-10 flex flex-wrap justify-center gap-4">
              {site.cvUrl ? (
                <ButtonLink
                  href={site.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  Download CV
                </ButtonLink>
              ) : (
                <ButtonLink href="/projects">View Projects</ButtonLink>
              )}
              <ButtonLink href="/#contact" variant="secondary">
                Contact Me
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal
            from="right"
            delay={0.7}
            className="col-span-1 hidden items-center justify-center md:flex"
          >
            <div className="relative aspect-[8/11] w-full max-w-[26vw] overflow-hidden rounded-full bg-slate-500 grayscale transition duration-300 hover:grayscale-0">
              <Photo
                src={site.photos.hero}
                alt={site.fullName}
                sizes="26vw"
                priority
              />
            </div>
          </Reveal>
        </div>
      </FullPageSection>

      <FeatureSection
        id="about"
        title="About Me"
        description="A brief introduction to my journey as a software engineer."
        photo={site.photos.about}
        photoAlt={site.fullName}
      >
        <ButtonLink href="/about">Learn More</ButtonLink>
      </FeatureSection>

      <FeatureSection
        id="projects"
        title="My Projects"
        description="Selected works that I've built and am currently working on."
        photo={site.photos.projects}
        photoAlt="Projects"
      >
        <ButtonLink href="/projects">Learn More</ButtonLink>
      </FeatureSection>

      <FeatureSection
        id="contact"
        title="Get In Touch"
        description={
          <>
            Feel free to contact me if you have any questions or just want to
            say hi.
            <a
              href={`mailto:${site.email}`}
              className="mt-4 block text-gray-500 hover:text-black"
            >
              {site.email}
            </a>
          </>
        }
        photo={site.photos.contact}
        photoAlt="Contact"
      >
        <SocialLinks />
      </FeatureSection>
    </FullPage>
  );
}
