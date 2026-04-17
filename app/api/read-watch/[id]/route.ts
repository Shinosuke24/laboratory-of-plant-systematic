import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithRole } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const item = await prisma.readWatch.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        updatedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("[API] Error fetching read-watch item:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUserWithRole();

    // Only asisten can update
    if (user?.role !== "ASISTEN") {
      return NextResponse.json(
        { error: "Only ASISTEN can manage Read & Watch" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const data: {
      title?: string;
      description?: string | null;
      category?: string;
      content?: string | null;
      fileUrl?: string | null;
      imageUrl?: string | null;
      updatedById?: string;
    } = {};

    if ("title" in body) data.title = body.title;
    if ("description" in body)
      data.description = body.description?.trim() || null;
    if ("category" in body) data.category = body.category;
    if ("content" in body) data.content = body.content?.trim() || null;
    if ("fileUrl" in body) data.fileUrl = body.fileUrl?.trim() || null;
    if ("imageUrl" in body) data.imageUrl = body.imageUrl?.trim() || null;
    data.updatedById = user.id;

    const item = await prisma.readWatch.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        updatedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[API] Error updating read-watch item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUserWithRole();

    // Only asisten can delete
    if (user?.role !== "ASISTEN") {
      return NextResponse.json(
        { error: "Only ASISTEN can manage Read & Watch" },
        { status: 403 },
      );
    }

    const { id } = await params;
    await prisma.readWatch.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error deleting read-watch item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 },
    );
  }
}
