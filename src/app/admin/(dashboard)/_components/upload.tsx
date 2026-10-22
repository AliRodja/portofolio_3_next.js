"use client";

import { upload } from "@vercel/blob/client";
import { createContext, useContext, type ReactNode } from "react";
import { UPLOAD_MAX_SIZE, UPLOAD_TYPES, type UploadMode } from "@/lib/uploads";

// The server decides where uploads go (see getUploadMode) and passes it down
// once from the dashboard layout.
const UploadModeContext = createContext<UploadMode>("disabled");

export function UploadModeProvider({
  mode,
  children,
}: {
  mode: UploadMode;
  children: ReactNode;
}) {
  return <UploadModeContext value={mode}>{children}</UploadModeContext>;
}

export function useUploadMode() {
  return useContext(UploadModeContext);
}

// Uploads one file and returns its URL, or throws an Error with a message
// that can be shown as is.
export async function uploadFile(
  mode: UploadMode,
  file: File,
  folder: string,
): Promise<string> {
  if (!UPLOAD_TYPES.includes(file.type)) {
    throw new Error(`"${file.name}" is not a JPG, PNG, WebP, AVIF, GIF, or PDF.`);
  }
  if (file.size > UPLOAD_MAX_SIZE) {
    throw new Error(`"${file.name}" is larger than 10 MB.`);
  }

  if (mode === "blob") {
    try {
      const blob = await upload(`${folder}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      return blob.url;
    } catch (error) {
      console.error(error);
      throw new Error("Upload to Vercel Blob failed. Check BLOB_READ_WRITE_TOKEN.");
    }
  }

  if (mode === "local") {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    const response = await fetch("/api/admin/upload/local", { method: "POST", body });
    const result = (await response.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
    };
    if (!response.ok || !result.url) {
      throw new Error(result.error ?? "Upload failed.");
    }
    return result.url;
  }

  throw new Error(
    "Uploads are not set up. Add BLOB_READ_WRITE_TOKEN, or use a link instead.",
  );
}
