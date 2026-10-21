import { Footer } from "@/components/footer";

export default function AboutLayout({ children }: LayoutProps<"/about">) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
