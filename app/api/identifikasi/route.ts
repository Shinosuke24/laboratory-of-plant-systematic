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

    const identifikasi = await prisma.identifikasi.findMany({
      where: {
        ...(status && { status }),
        ...(isAdmin ? {} : { userId: user.id }),
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(identifikasi);
  } catch (error) {
    console.error("[API] Error fetching identifikasi:", error);
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
      namaKode,
      familyKelompok,
    } = body;

    if (
      !email ||
      !nama ||
      !nim ||
      !namaInstitusi ||
      !noWa ||
      !namaDosenPembimbing ||
      !jadwalPelaksanaan ||
      !suratPermohonanUrl ||
      !namaKode ||
      !familyKelompok
    ) {
      return NextResponse.json(
        { error: "Required fields are incomplete" },
        { status: 400 },
      );
    }

    const identifikasi = await prisma.identifikasi.create({
      data: {
        userId: user.id,
        // Kept for backward compatibility with the previous structure.
        plantName: namaKode,
        scientificName: familyKelompok,
        description: `Scheduled date: ${jadwalPelaksanaan}`,
        imageUrl: suratPermohonanUrl,
        email,
        nama,
        nim,
        namaInstitusi,
        noWa,
        namaDosenPembimbing,
        jadwalPelaksanaan,
        suratPermohonanUrl,
        namaKode,
        familyKelompok,
        status: "PENDING",
      },
    });

    return NextResponse.json(identifikasi, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating identifikasi:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 },
    );
  }
}
