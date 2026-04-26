import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  coupleProfiles, 
  marriageApplications, 
  stageHistory, 
  requiredDocuments, 
  notifications 
} from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

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

// Helper to generate Registration Number: KP-YYYY-XXXX
async function generateRegistrationNumber() {
  const year = new Date().getFullYear();
  // In a real app, you'd count existing records for the year. 
  // For simplicity here, we'll use a random 4 digit string.
  const random4 = Math.floor(1000 + Math.random() * 9000); 
  return `KP-${year}-${random4}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "COUPLE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    // Check if profile already exists
    const existing = await db.select().from(coupleProfiles).where(eq(coupleProfiles.userId, userId)).limit(1);
    
    if (existing.length > 0) {
      return NextResponse.json({ error: "Profil sudah ada. Hubungi admin untuk perubahan." }, { status: 400 });
    }

    const regNumber = await generateRegistrationNumber();
    const profileId = nanoid();
    const appId = nanoid();
    const now = new Date();

    // Insert Couple Profile
    await db.insert(coupleProfiles).values({
      id: profileId,
      userId,
      registrationNumber: regNumber,
      groomName: body.groomName,
      groomBirthdate: body.groomBirthdate,
      groomPhone: body.groomPhone,
      groomBaptismChurch: body.groomBaptismChurch,
      brideName: body.brideName,
      brideBirthdate: body.brideBirthdate,
      bridePhone: body.bridePhone,
      brideBaptismChurch: body.brideBaptismChurch,
      plannedWeddingDate: body.plannedWeddingDate,
      createdAt: now,
    });

    // Insert Marriage Application
    await db.insert(marriageApplications).values({
      id: appId,
      coupleProfileId: profileId,
      currentStage: 1,
      createdAt: now,
      updatedAt: now,
    });

    // Insert Stage History
    await db.insert(stageHistory).values({
      id: nanoid(),
      applicationId: appId,
      stageNumber: 1,
      note: "Pendaftaran awal berhasil. Menunggu pengecekan sekretariat.",
      changedBy: userId, // System/User initiated
      changedAt: now,
    });

    // Insert Required Documents
    const docs = DEFAULT_DOCUMENTS.map((doc) => ({
      id: nanoid(),
      applicationId: appId,
      documentName: doc,
      isReceived: false,
      receivedAt: null,
    }));
    await db.insert(requiredDocuments).values(docs);

    // Insert Notification
    await db.insert(notifications).values({
      id: nanoid(),
      userId,
      message: `Selamat! Pendaftaran awal Anda telah diterima. Nomor Registrasi: ${regNumber}`,
      isRead: false,
      createdAt: now,
    });

    return NextResponse.json({ 
      success: true, 
      registrationNumber: regNumber 
    });

  } catch (error) {
    console.error("Profile Creation Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem." }, { status: 500 });
  }
}
