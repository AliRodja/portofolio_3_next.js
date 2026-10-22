import {
  faEnvelope,
  faFolderOpen,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Reveal } from "@/components/motion/reveal";
import { FullPage, FullPageSection } from "@/components/sections/fullpage";
import { SocialLinks } from "@/components/sections/social-links";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { getProfile } from "@/db/queries/profile";
import { FeatureSection } from "./_components/feature-section";

const sections = [
  { id: "home", label: "Home", icon: faHouse },
  { id: "about", label: "About", icon: faUser },
  { id: "projects", label: "Projects", icon: faFolderOpen },
  { id: "contact", label: "Contact", icon: faEnvelope },
];

export default async function HomePage() {
  const profile = await getProfile();

  return (
    <FullPage sections={sections}>
      <FullPageSection id="home">
        <div className="mx-auto grid w-[82%] max-w-screen-2xl grid-cols-1 gap-4 p-10 md:grid-cols-3">
          <div className="col-span-2 flex flex-col items-center justify-center text-center md:items-start md:text-start">
            <Reveal className="mx-auto my-10 md:hidden">
              <div className="relative h-60 w-60 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/20 grayscale transition duration-300 hover:grayscale-0">
                <Photo
                  src={profile.heroPhoto}
                  alt={profile.fullName}
                  sizes="240px"
                  priority
                />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mb-3 font-display text-xl tracking-[.5rem] text-white/60 uppercase">
                {profile.fullName}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <h1 className="my-2 text-4xl font-bold text-white md:my-5 md:text-6xl 2xl:text-8xl">
                {profile.role}
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="mt-4 font-display text-base leading-[1.7rem] tracking-wider text-white/70 2xl:text-xl">
                {profile.intro}
              </p>
            </Reveal>
            <Reveal delay={0.5} className="mt-10 flex flex-wrap justify-center gap-4">
              {profile.cvUrl ? (
                // A plain link, so Next.js does not treat the PDF as a route.
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className={buttonClass("glassDark")}
                >
                  Download CV
                </a>
              ) : (
                <ButtonLink href="/projects" variant="glassDark">
                  View Projects
                </ButtonLink>
              )}
              <ButtonLink href="/#contact" variant="glass">
                Contact Me
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal
            from="right"
            delay={0.7}
            className="col-span-1 hidden items-center justify-center md:flex"
          >
            <div className="relative aspect-8/11 w-full max-w-[26vw] overflow-hidden rounded-full bg-white/5 ring-1 ring-white/20 grayscale transition duration-300 hover:grayscale-0">
              <Photo
                src={profile.heroPhoto}
                alt={profile.fullName}
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
        photo={profile.aboutPhoto}
        photoAlt={profile.fullName}
      >
        <ButtonLink href="/about" variant="glassDark">
          Learn More
        </ButtonLink>
      </FeatureSection>

      <FeatureSection
        id="projects"
        title="My Projects"
        description="Selected works that I've built and am currently working on."
        photo={profile.projectsPhoto}
        photoAlt="Projects"
      >
        <ButtonLink href="/projects" variant="glassDark">
          Learn More
        </ButtonLink>
      </FeatureSection>

      <FeatureSection
        id="contact"
        title="Get In Touch"
        description={
          <>
            Feel free to contact me if you have any questions or just want to
            say hi.
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 block text-white/70 hover:text-white"
            >
              {profile.email}
            </a>
          </>
        }
        photo={profile.contactPhoto}
        photoAlt="Contact"
      >
        <SocialLinks email={profile.email} socials={profile.socials} />
      </FeatureSection>
    </FullPage>
  );
}
