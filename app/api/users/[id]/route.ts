import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithRole } from "@/lib/auth-utils";

const ALLOWED_ROLES = ["ADMIN", "ASISTEN", "MAHASISWA"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUserWithRole();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only ADMIN can change roles" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const nextRole = String(body?.role || "").toUpperCase();

    if (!ALLOWED_ROLES.includes(nextRole as (typeof ALLOWED_ROLES)[number])) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    if (currentUser.id === id && nextRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin cannot downgrade their own role" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: nextRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[API] Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 },
    );
  }
}
