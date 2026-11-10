import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/session";
import { UPLOAD_MAX_SIZE, UPLOAD_TYPES } from "@/lib/uploads";

// Issue client upload tokens so browser uploads go straight to Vercel Blob and bypass the Server Action body limit.
export async function POST(request: Request) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: UPLOAD_TYPES,
          maximumSizeInBytes: UPLOAD_MAX_SIZE,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
