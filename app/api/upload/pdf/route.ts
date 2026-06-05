import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] PDF upload started");
    
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      console.log("[v0] No file provided");
      return NextResponse.json(
        { error: "A PDF file is required" },
        { status: 400 },
      );
    }

    console.log("[v0] File received:", { name: file.name, type: file.type, size: file.size });

    if (file.type !== "application/pdf") {
      console.log("[v0] Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      console.log("[v0] File too large:", file.size);
      return NextResponse.json(
        { error: "Maximum file size is 5 MB" },
        { status: 400 },
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${randomUUID()}-${safeName}`;
    const blobPath = `pdf/${fileName}`;

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
    console.error("[v0] Error uploading PDF:", error);
    return NextResponse.json(
      { error: "Failed to upload PDF: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}
