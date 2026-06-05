import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithRole } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    console.log("[API] GET /identifikasi - Checking auth...");
    
    const user = await getCurrentUserWithRole();
    console.log("[API] User from auth:", { 
      id: user?.id, 
      email: user?.email,
      role: user?.role 
    });

    if (!user?.id) {
      console.log("[API] No user found - returning Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const isAdmin = user.role === "ADMIN";

    console.log("[API] Fetching identifikasi - admin:", isAdmin, "userId:", user.id);

    const identifikasi = await prisma.identifikasi.findMany({
      where: {
        ...(status && { status }),
        ...(isAdmin ? {} : { userId: user.id }),
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    console.log("[API] Found identifikasi:", identifikasi.length);
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
    console.log("[API] POST /identifikasi - Checking auth...");
    
    const user = await getCurrentUserWithRole();
    console.log("[API] User from auth:", { 
      id: user?.id, 
      email: user?.email,
      role: user?.role 
    });

    if (!user?.id) {
      console.log("[API] No user found - returning Unauthorized");
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

    console.log("[API] Creating identifikasi for user:", user.id);

    const identifikasi = await prisma.identifikasi.create({
      data: {
        userId: user.id,
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

    console.log("[API] Created identifikasi:", identifikasi.id);
    return NextResponse.json(identifikasi, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating identifikasi:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 },
    );
  }
}
