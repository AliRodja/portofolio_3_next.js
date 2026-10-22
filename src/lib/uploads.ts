export const UPLOAD_MAX_SIZE = 10 * 1024 * 1024;

export const UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "application/pdf",
];

// "blob" uploads to Vercel Blob. "local" writes into public/uploads, which
// only works in development: a production server serves just the files that
// existed at build time, and Vercel's filesystem is read-only.
export type UploadMode = "blob" | "local" | "disabled";

export function getUploadMode(): UploadMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return process.env.NODE_ENV === "development" ? "local" : "disabled";
}
