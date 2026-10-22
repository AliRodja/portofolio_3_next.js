import { Footer } from "@/components/layout/footer";
import { LightStreaks } from "@/components/layout/glass-backdrop";

export default function AboutLayout({ children }: LayoutProps<"/about">) {
  return (
    <>
      <LightStreaks variant="page" />
      {children}
      <Footer />
    </>
  );
}
