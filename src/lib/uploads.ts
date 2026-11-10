export const UPLOAD_MAX_SIZE = 10 * 1024 * 1024;

export const UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "application/pdf",
];

// Local disk uploads only work in development because Vercel's production filesystem is read-only.
export type UploadMode = "blob" | "local" | "disabled";

export function getUploadMode(): UploadMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return process.env.NODE_ENV === "development" ? "local" : "disabled";
}
