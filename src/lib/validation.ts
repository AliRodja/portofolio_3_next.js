import { z } from "zod";

// A web link for an href. Plain z.url() also accepts javascript: and data:
// URLs, which would run code when a visitor clicks the link.
export const httpUrl = z.url({
  protocol: /^https?$/,
  error: "Enter a full URL starting with https://",
});

// An empty string (not set) or a web link.
export const optionalHttpUrl = z.union([z.literal(""), httpUrl]);

// An uploaded file or image: a path inside public/ ("/images/me.jpg") or an
// https URL such as a Vercel Blob file. Protocol-relative "//host" paths are
// rejected, since they point at another site.
export const mediaUrl = z
  .string()
  .trim()
  .refine(
    (value) => /^\/(?!\/)/.test(value) || /^https:\/\//i.test(value),
    "Use a path starting with / or an https:// link",
  );

// An empty string (not set) or a media URL.
export const optionalMediaUrl = z.union([z.literal(""), mediaUrl]);
