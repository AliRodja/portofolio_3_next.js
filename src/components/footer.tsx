import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { site } from "@/data/site";

// Cache Components does not allow reading the current time during prerendering
// unless the result is cached.
async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className="mt-5 flex flex-col items-center overflow-hidden">
      <div className="flex min-h-[50vh] min-w-[80vw] flex-col items-center justify-center border-b-2">
        <Link href="/#contact" className="group text-center">
          <Reveal from="left" delay={0.2}>
            <p className="font-display text-xl font-medium whitespace-nowrap text-gray-400 group-hover:underline md:tracking-[0.5rem]">
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
      <p className="my-5 text-sm text-gray-800">
        &copy; {year} - <span className="text-lg text-gray-700">{site.name}</span>
      </p>
    </footer>
  );
}
