import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  marriageApplications,
  coupleProfiles,
  requiredDocuments,
  stageHistory,
  notifications,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

const DEFAULT_DOCUMENTS = [
  "Surat Baptis Pria",
  "Surat Baptis Wanita",
  "Fotokopi KTP Pria",
  "Fotokopi KTP Wanita",
  "Surat Pengantar Paroki",
  "Surat Keterangan Belum Menikah Pria",
  "Surat Keterangan Belum Menikah Wanita",
  "Akta Kelahiran Pria",
  "Akta Kelahiran Wanita",
  "Pas Foto (Berdampingan)",
  "Surat Izin Orang Tua",
];

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "COUPLE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // Ambil profil couple
    const profileRecord = await db
      .select()
      .from(coupleProfiles)
      .where(eq(coupleProfiles.userId, userId))
      .limit(1);

    if (!profileRecord[0]) {
      return NextResponse.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    }

    const profile = profileRecord[0];

    // Cari aplikasi lama yang berstatus dibatalkan (stage = 99)
    const canceledApps = await db
      .select()
      .from(marriageApplications)
      .where(eq(marriageApplications.coupleProfileId, profile.id));

    const canceledApp = canceledApps.find((a) => a.currentStage === 99);

    if (!canceledApp) {
      return NextResponse.json(
        { error: "Tidak ada pendaftaran yang dibatalkan untuk didaftarkan ulang." },
        { status: 400 }
      );
    }

    // Buat aplikasi baru dengan referensi ke aplikasi lama
    const newAppId = nanoid();
    await db.insert(marriageApplications).values({
      id: newAppId,
      coupleProfileId: profile.id,
      currentStage: 1,
      isReregistration: true,
      previousApplicationId: canceledApp.id,
      createdAt: now,
      updatedAt: now,
    });

    // Buat 11 dokumen default untuk aplikasi baru
    const docValues = DEFAULT_DOCUMENTS.map((name) => ({
      id: nanoid(),
      applicationId: newAppId,
      documentName: name,
      isReceived: false,
    }));
    await db.insert(requiredDocuments).values(docValues);

    // Catat di riwayat tahap
    await db.insert(stageHistory).values({
      id: nanoid(),
      applicationId: newAppId,
      stageNumber: 1,
      note: "Pendaftaran ulang berhasil diajukan. Sekretariat akan segera meninjau berkas Anda.",
      changedBy: userId,
      changedAt: now,
    });

    // Kirim notifikasi ke couple
    await db.insert(notifications).values({
      id: nanoid(),
      userId: userId,
      message:
        "Pendaftaran ulang Anda telah berhasil diajukan. Anda kini berada di Tahap 1. Silakan lengkapi kembali dokumen persyaratan dan tunggu konfirmasi dari Sekretariat.",
      isRead: false,
      createdAt: now,
    });

    return NextResponse.json({ success: true, applicationId: newAppId });
  } catch (error) {
    console.error("Daftar ulang error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
