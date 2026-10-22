import { Footer } from "@/components/layout/footer";
import { LightStreaks } from "@/components/layout/glass-backdrop";

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  return (
    <>
      <LightStreaks variant="page" />
      {children}
      <Footer />
    </>
  );
}
