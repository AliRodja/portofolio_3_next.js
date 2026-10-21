import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <section className="py-32">
      <Container className="text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
          404
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-muted">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
          <ButtonLink href="/">Back to home</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
