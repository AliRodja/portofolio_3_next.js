import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { getProfile } from "@/db/queries/profile";

// Cache Components requires "use cache" before reading new Date() during prerendering.
async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const [year, profile] = await Promise.all([getCurrentYear(), getProfile()]);

  return (
    <footer className="mt-5 flex flex-col items-center overflow-hidden max-md:pb-24">
      <div className="flex min-h-[50vh] w-[85vw] flex-col items-center justify-center border-b border-ink/20 px-4">
        <Link href="/#contact" className="group text-center">
          <Reveal from="left" delay={0.2}>
            <p className="font-display text-lg font-medium text-ink/70 group-hover:underline sm:text-xl md:tracking-[0.2em] uppercase">
              Want something like this?
            </p>
          </Reveal>
          <Reveal from="right" delay={0.5}>
            <p className="mt-3 font-display text-4xl font-medium group-hover:underline sm:text-5xl md:text-7xl">
              Get In Touch
              <FontAwesomeIcon icon={faCircleArrowRight} className="ml-3" />
            </p>
          </Reveal>
        </Link>
      </div>
      <p className="my-5 text-sm text-ink/70">
        &copy; {year} - <span className="text-lg text-ink/85">{profile.name}</span>
      </p>
    </footer>
  );
}
