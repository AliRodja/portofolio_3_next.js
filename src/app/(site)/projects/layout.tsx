import { Footer } from "@/components/layout/footer";

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
