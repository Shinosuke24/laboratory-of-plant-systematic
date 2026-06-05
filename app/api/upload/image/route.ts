import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Image upload started");
    
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      console.log("[v0] No file provided");
      return NextResponse.json(
        { error: "An image file is required" },
        { status: 400 },
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const hasValidType = ALLOWED_IMAGE_TYPES.has(file.type);
    const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.has(extension);

    if (!hasValidType && !hasValidExtension) {
      console.log("[v0] Invalid image format:", { type: file.type, extension });
      return NextResponse.json(
        { error: "Unsupported image format. Use JPG, PNG, WEBP, or GIF" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      console.log("[v0] File too large:", file.size);
      return NextResponse.json(
        { error: "Maximum image size is 4 MB" },
        { status: 400 },
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${randomUUID()}-${safeName}`;
    const blobPath = `images/${fileName}`;

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
    console.error("[v0] Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}
