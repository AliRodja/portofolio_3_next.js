import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/session";
import { getUploadMode, UPLOAD_MAX_SIZE, UPLOAD_TYPES } from "@/lib/uploads";

// Development fallback when BLOB_READ_WRITE_TOKEN is not set: saves the file
// into public/uploads/<folder>/ and returns its public path.
export async function POST(request: Request) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  if (getUploadMode() !== "local") {
    return NextResponse.json(
      { error: "Local uploads only work in development." },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(folder)) {
    return NextResponse.json({ error: "Invalid folder." }, { status: 400 });
  }
  if (!UPLOAD_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Use a JPG, PNG, WebP, AVIF, GIF, or PDF file." },
      { status: 400 },
    );
  }
  if (file.size > UPLOAD_MAX_SIZE) {
    return NextResponse.json(
      { error: "The file is larger than 10 MB." },
      { status: 400 },
    );
  }

  // Keep the original name readable, but make it safe and unique.
  const extension = path.extname(file.name).toLowerCase();
  const base = path
    .basename(file.name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const fileName = `${base || "file"}-${randomUUID().slice(0, 8)}${extension}`;

  const directory = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${folder}/${fileName}` });
}
