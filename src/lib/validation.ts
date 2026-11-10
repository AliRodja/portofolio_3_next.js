import { z } from "zod";

// Restrict to http(s) because plain z.url() also accepts javascript: and data: URLs.
export const httpUrl = z.url({
  protocol: /^https?$/,
  error: "Enter a full URL starting with https://",
});

export const optionalHttpUrl = z.union([z.literal(""), httpUrl]);

// Allow root-relative paths or https:// URLs, while rejecting protocol-relative "//host" URLs.
export const mediaUrl = z
  .string()
  .trim()
  .refine(
    (value) => /^\/(?!\/)/.test(value) || /^https:\/\//i.test(value),
    "Use a path starting with / or an https:// link",
  );

export const optionalMediaUrl = z.union([z.literal(""), mediaUrl]);
