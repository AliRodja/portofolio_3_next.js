import {
  faEnvelope,
  faFolderOpen,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Reveal } from "@/components/motion/reveal";
import { FullPage, FullPageSection } from "@/components/sections/fullpage";
import { SocialLinks } from "@/components/sections/social-links";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { site } from "@/data/site";
import { FeatureSection } from "./_components/feature-section";

const sections = [
  { id: "home", label: "Home", icon: faHouse },
  { id: "about", label: "About", icon: faUser },
  { id: "projects", label: "Projects", icon: faFolderOpen },
  { id: "contact", label: "Contact", icon: faEnvelope },
];

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
