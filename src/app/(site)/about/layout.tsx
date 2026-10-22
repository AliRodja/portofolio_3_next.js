import { Footer } from "@/components/layout/footer";

export default function AboutLayout({ children }: LayoutProps<"/about">) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
