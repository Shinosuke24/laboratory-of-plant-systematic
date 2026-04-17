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
    const kerjaLembur = await prisma.kerjaLembur.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!kerjaLembur) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isAdmin = user.role === "ADMIN";
    if (kerjaLembur.userId !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(kerjaLembur);
  } catch (error) {
    console.error("[API] Error fetching kerja-lembur:", error);
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

    const existing = await prisma.kerjaLembur.findUnique({
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
    if (body.date) updateData.date = new Date(body.date);
    if (body.hours) updateData.hours = parseInt(body.hours);
    if (body.description) updateData.description = body.description;

    const updated = await prisma.kerjaLembur.update({
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
          serviceName: "Kerja Lembur",
          status: String(body.status),
          submissionTitle: existing.date
            ? new Date(existing.date).toLocaleDateString()
            : "Overtime Request",
        });
      } catch (mailError) {
        console.error(
          "[EMAIL] Failed to send overtime notification:",
          mailError,
        );
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] Error updating kerja-lembur:", error);
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

    const existing = await prisma.kerjaLembur.findUnique({
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

    await prisma.kerjaLembur.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error deleting kerja-lembur:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
