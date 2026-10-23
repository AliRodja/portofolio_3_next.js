import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const blobStorage = "https://*.public.blob.vercel-storage.com";

// Which sources the browser may load. Next.js puts small inline scripts in
// every page, and nonces would force every page to render on each request,
// so scripts allow 'unsafe-inline'; everything else is limited to this site
// plus the few services it uses. See the Content Security Policy guide in
// node_modules/next/dist/docs.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Motion and Font Awesome set inline styles.
  "style-src 'self' 'unsafe-inline'",
  // Uploaded images and GitHub avatars, shown directly in the dashboard.
  `img-src 'self' blob: data: ${blobStorage} https://avatars.githubusercontent.com`,
  "font-src 'self'",
  // Dashboard uploads go from the browser straight to Vercel Blob.
  `connect-src 'self' https://vercel.com${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Nobody may show this site inside a frame (clickjacking).
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Browsers remember to use HTTPS only, for two years. Ignored over plain
  // HTTP, so it does nothing on localhost.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Do not guess file types, so an upload cannot be run as a script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Older browsers that ignore frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  // Other sites only see this site's origin, not full dashboard URLs.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Features the site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Do not advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  images: {
    // Images uploaded from the dashboard live on Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // GitHub avatars for the signed-in user in the dashboard.
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
