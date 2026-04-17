import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithRole } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    const items = await prisma.readWatch.findMany({
      where: category ? { category } : {},
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        updatedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] Error fetching read-watch items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserWithRole();

    // Only asisten can create
    if (user?.role !== "ASISTEN") {
      return NextResponse.json(
        { error: "Only ASISTEN can manage Read & Watch" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, description, category, content, fileUrl, imageUrl } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 },
      );
    }

    const item = await prisma.readWatch.create({
      data: {
        createdById: user.id,
        updatedById: user.id,
        title,
        description: description?.trim() || null,
        category,
        content: content?.trim() || null,
        fileUrl: fileUrl?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        updatedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating read-watch item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 },
    );
  }
}
