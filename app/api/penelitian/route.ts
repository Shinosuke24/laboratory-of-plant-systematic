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

    const penelitian = await prisma.penelitian.findMany({
      where: {
        ...(status && { status }),
        ...(isAdmin ? {} : { userId: user.id }),
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(penelitian);
  } catch (error) {
    console.error("[API] Error fetching penelitian:", error);
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
      jadwalPelaksanaan,
      suratPermohonanUrl,
    } = body;

    if (
      !email ||
      !nama ||
      !nim ||
      !namaInstitusi ||
      !noWa ||
      !namaDosenPembimbing ||
      !jadwalPelaksanaan ||
      !suratPermohonanUrl
    ) {
      return NextResponse.json(
        { error: "Required fields are incomplete" },
        { status: 400 },
      );
    }

    const penelitian = await prisma.penelitian.create({
      data: {
        userId: user.id,
        // Kept for backward compatibility with the previous structure.
        title: `Research Request - ${nama}`,
        description: `Scheduled date: ${jadwalPelaksanaan}`,
        startDate: new Date(),
        endDate: null,
        documentUrl: suratPermohonanUrl,
        notes: null,
        email,
        nama,
        nim,
        namaInstitusi,
        noWa,
        namaDosenPembimbing,
        jadwalPelaksanaan,
        suratPermohonanUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json(penelitian, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating penelitian:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 },
    );
  }
}
