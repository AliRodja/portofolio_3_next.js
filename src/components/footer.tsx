import { Container } from "@/components/container";
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
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
        <p>
          &copy; {year} {site.fullName}
        </p>
        <ul className="flex gap-6">
          {site.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-foreground"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
