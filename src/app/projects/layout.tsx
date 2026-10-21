import { Footer } from "@/components/footer";

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
