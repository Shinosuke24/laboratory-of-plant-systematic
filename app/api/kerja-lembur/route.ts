import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithRole } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserWithRole();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const isAdmin = user.role === "ADMIN";

    const kerjaLembur = await prisma.kerjaLembur.findMany({
      where: {
        ...(status && { status }),
        ...(isAdmin ? {} : { userId: user.id }),
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(kerjaLembur);
  } catch (error) {
    console.error("[API] Error fetching kerja-lembur:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserWithRole();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      email,
      nama,
      nim,
      namaInstitusi,
      noWa,
      namaDosenPembimbing,
      jadwalPelaksanaanLembur,
      suratPermohonanUrl,
    } = body;

    if (
      !email ||
      !nama ||
      !nim ||
      !namaInstitusi ||
      !noWa ||
      !namaDosenPembimbing ||
      !jadwalPelaksanaanLembur ||
      !suratPermohonanUrl
    ) {
      return NextResponse.json(
        { error: "Required fields are incomplete" },
        { status: 400 },
      );
    }

    const kerjaLembur = await prisma.kerjaLembur.create({
      data: {
        userId: user.id,
        // Kept for backward compatibility with the previous structure.
        date: new Date(),
        hours: 1,
        description: `Overtime schedule: ${jadwalPelaksanaanLembur}`,
        email,
        nama,
        nim,
        namaInstitusi,
        noWa,
        namaDosenPembimbing,
        jadwalPelaksanaanLembur,
        suratPermohonanUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json(kerjaLembur, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating kerja-lembur:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 },
    );
  }
}
