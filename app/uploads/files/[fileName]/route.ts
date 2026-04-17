import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  txt: "text/plain",
  csv: "text/csv",
  zip: "application/zip",
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
      "files",
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
      // Backward compatibility for PDFs stored in uploads/pdf.
      const fallbackFilePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "pdf",
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
