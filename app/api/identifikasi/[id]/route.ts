import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithRole } from "@/lib/auth-utils";
import { sendApprovalStatusEmail } from "@/lib/email-notification";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUserWithRole();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const identifikasi = await prisma.identifikasi.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!identifikasi) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isAdmin = user.role === "ADMIN";
    if (identifikasi.userId !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(identifikasi);
  } catch (error) {
    console.error("[API] Error fetching identifikasi:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
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
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = user.role === "ADMIN";
    const body = await request.json();

    const existing = await prisma.identifikasi.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.userId !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData: any = {};
    if (body.status && !isAdmin) {
      return NextResponse.json(
        { error: "Only ADMIN can approve or reject" },
        { status: 403 },
      );
    }
    if (isAdmin && body.status) {
      updateData.status = body.status;
    }
    if (body.plantName) updateData.plantName = body.plantName;
    if (body.scientificName) updateData.scientificName = body.scientificName;
    if (body.description) updateData.description = body.description;

    const updated = await prisma.identifikasi.update({
      where: { id },
      data: updateData,
    });

    if (
      isAdmin &&
      body.status &&
      existing.status !== body.status &&
      existing.user?.email
    ) {
      try {
        await sendApprovalStatusEmail({
          to: existing.user.email,
          mahasiswaName: existing.user.name,
          serviceName: "Identifikasi",
          status: String(body.status),
          submissionTitle: existing.plantName,
        });
      } catch (mailError) {
        console.error(
          "[EMAIL] Failed to send identification notification:",
          mailError,
        );
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] Error updating identifikasi:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUserWithRole();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = user.role === "ADMIN";

    const existing = await prisma.identifikasi.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (
      existing.userId !== user.id &&
      !isAdmin &&
      existing.status !== "PENDING"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.identifikasi.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error deleting identifikasi:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
