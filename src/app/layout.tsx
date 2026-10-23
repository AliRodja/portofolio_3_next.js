import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
import { Jost, Poppins } from "next/font/google";
import { getProfile } from "@/db/queries/profile";
import { siteUrl } from "@/lib/site-config";
import { themeScript } from "@/lib/theme";
import "./globals.css";

// The Font Awesome stylesheet is imported above, so it does not need to be
// injected again at runtime.
config.autoAddCss = false;

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `${profile.fullName} | Portfolio`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${profile.name}`,
    },
    description: profile.description,
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: title,
      title,
      description: profile.description,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script below may add data-theme before React hydrates.
    <html lang="en" className={`${poppins.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

