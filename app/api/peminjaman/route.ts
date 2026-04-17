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

    const peminjaman = await prisma.peminjaman.findMany({
      where: {
        ...(status && { status }),
        ...(isAdmin ? {} : { userId: user.id }),
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(peminjaman);
  } catch (error) {
    console.error("[API] Error fetching peminjaman:", error);
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
      tahunMasuk,
      nama,
      nim,
      institusi,
      noWa,
      dosenPembimbing,
      persetujuanPembimbing,
      judulPenelitian,
      tujuanPenelitian,
      fasilitasDigunakan,
      waktuMulaiPenggunaan,
      waktuSelesaiPengembalian,
      dokumenPermohonanUrl,
    } = body;

    if (
      !email ||
      !tahunMasuk ||
      !nama ||
      !nim ||
      !institusi ||
      !noWa ||
      !dosenPembimbing ||
      !persetujuanPembimbing ||
      !judulPenelitian ||
      !tujuanPenelitian ||
      !fasilitasDigunakan ||
      !waktuMulaiPenggunaan ||
      !waktuSelesaiPengembalian ||
      !dokumenPermohonanUrl
    ) {
      return NextResponse.json(
        { error: "Required fields are incomplete" },
        { status: 400 },
      );
    }

    const fasilitasList = Array.isArray(fasilitasDigunakan)
      ? fasilitasDigunakan.filter(Boolean).join(", ")
      : String(fasilitasDigunakan);

    const persetujuan = String(persetujuanPembimbing).toUpperCase();
    if (!["TELAH_DISETUJUI", "BELUM"].includes(persetujuan)) {
      return NextResponse.json(
        { error: "Invalid supervisor approval status" },
        { status: 400 },
      );
    }

    const peminjaman = await prisma.peminjaman.create({
      data: {
        userId: user.id,
        // Kept for backward compatibility with the previous structure.
        toolName: judulPenelitian,
        quantity: 1,
        borrowDate: new Date(waktuMulaiPenggunaan),
        expectedReturn: new Date(waktuSelesaiPengembalian),
        notes: tujuanPenelitian,
        email,
        tahunMasuk: parseInt(String(tahunMasuk)),
        nama,
        nim,
        institusi,
        noWa,
        dosenPembimbing,
        persetujuanPembimbing: persetujuan,
        judulPenelitian,
        tujuanPenelitian,
        fasilitasDigunakan: fasilitasList,
        waktuMulaiPenggunaan: new Date(waktuMulaiPenggunaan),
        waktuSelesaiPengembalian: new Date(waktuSelesaiPengembalian),
        dokumenPermohonanUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json(peminjaman, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating peminjaman:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 },
    );
  }
}
