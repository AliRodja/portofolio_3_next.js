import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Images uploaded from the dashboard live on Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // GitHub avatars for the signed-in user in the dashboard.
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
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
