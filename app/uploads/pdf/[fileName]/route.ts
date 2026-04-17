import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { fileName: string } },
) {
  try {
    const fileName = params.fileName || "";

    // Block path traversal and unsupported file names.
    if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
      return new Response("Invalid file name", { status: 400 });
    }

    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    const contentType = CONTENT_TYPES[extension];

    if (!contentType) {
      return new Response("Unsupported file type", { status: 400 });
    }

    const primaryFilePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "pdf",
      fileName,
    );

    try {
      const fileBuffer = await readFile(primaryFilePath);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      });
    } catch {
      // Backward compatibility for old saved paths under uploads/files.
      const fallbackFilePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "files",
        fileName,
      );
      const fallbackBuffer = await readFile(fallbackFilePath);
      return new Response(fallbackBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      });
    }
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
