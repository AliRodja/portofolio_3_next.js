import { Navbar } from "@/components/layout/navbar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
