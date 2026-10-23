import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { getProfile } from "@/db/queries/profile";

// Cache Components does not allow reading the current time during prerendering
// unless the result is cached.
async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const [year, profile] = await Promise.all([getCurrentYear(), getProfile()]);

  return (
    // On phones the bottom padding keeps the copyright clear of the tab bar.
    <footer className="mt-5 flex flex-col items-center overflow-hidden max-md:pb-24">
      <div className="flex min-h-[50vh] min-w-[80vw] flex-col items-center justify-center border-b border-ink/20">
        <Link href="/#contact" className="group text-center">
          <Reveal from="left" delay={0.2}>
            <p className="font-display text-xl font-medium whitespace-nowrap text-ink/60 group-hover:underline md:tracking-[0.5rem]">
              Want something like this?
            </p>
          </Reveal>
          <Reveal from="right" delay={0.5}>
            <p className="mt-3 font-display text-5xl font-medium whitespace-nowrap group-hover:underline md:text-7xl">
              Get In Touch
              <FontAwesomeIcon icon={faCircleArrowRight} className="ml-3" />
            </p>
          </Reveal>
        </Link>
      </div>
      <p className="my-5 text-sm text-ink/60">
        &copy; {year} - <span className="text-lg text-ink/80">{profile.name}</span>
      </p>
    </footer>
  );
}
