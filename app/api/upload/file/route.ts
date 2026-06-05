import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import path from "path";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "application/zip",
  "application/x-zip-compressed",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".txt",
  ".csv",
  ".zip",
]);

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] File upload started");
    
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      console.log("[v0] No file provided");
      return NextResponse.json(
        { error: "An attachment file is required" },
        { status: 400 },
      );
    }

    const extension = path.extname(file.name).toLowerCase();
    const mimeAllowed = ALLOWED_FILE_TYPES.has(file.type);
    const extensionAllowed = ALLOWED_EXTENSIONS.has(extension);

    if (!mimeAllowed && !extensionAllowed) {
      console.log("[v0] Invalid file type:", { type: file.type, extension });
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Upload PDF, Office documents, text/csv, or zip.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      console.log("[v0] File too large:", file.size);
      return NextResponse.json(
        { error: "Maximum attachment size is 10 MB" },
        { status: 400 },
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${randomUUID()}-${safeName}`;
    const blobPath = `files/${fileName}`;

    console.log("[v0] Uploading to Vercel Blob:", blobPath);

    const blob = await put(blobPath, file, {
      access: "private",
    });

    console.log("[v0] Upload success:", blob.url);

    return NextResponse.json({
      url: blob.url,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("[v0] Error uploading attachment:", error);
    return NextResponse.json(
      { error: "Failed to upload attachment: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}
