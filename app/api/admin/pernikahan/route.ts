import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  marriageApplications,
  requiredDocuments,
  stageHistory,
  notifications,
  coupleProfiles,
  users
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import {
  sendStageAdvanceEmail,
  sendCancellationEmail,
  sendCeremonyScheduleEmail,
} from "@/lib/email";

const STAGE_NAMES = [
  "Pengisian Profil",
  "KPP",
  "Pemberkasan Dokumen",
  "Kanonik",
  "Selesai (Menunggu Pemberkatan)"
];

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = session.user.id;
    const body = await req.json();
    const { action, applicationId } = body;

    if (!applicationId) return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });

    const now = new Date();

    // Fetch app to get profileId to get userId
    const apps = await db.select().from(marriageApplications).where(eq(marriageApplications.id, applicationId)).limit(1);
    if (apps.length === 0) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    const app = apps[0];

    const profiles = await db.select().from(coupleProfiles).where(eq(coupleProfiles.id, app.coupleProfileId)).limit(1);
    const coupleUserId = profiles[0]?.userId;
    const coupleProfile = profiles[0];

    // Fetch couple's email for Resend
    let coupleEmail = "";
    let coupleName = "";
    if (coupleUserId) {
      const userRecord = await db.select({ email: users.email, name: users.name })
        .from(users).where(eq(users.id, coupleUserId)).limit(1);
      coupleEmail = userRecord[0]?.email || "";
      coupleName = userRecord[0]?.name || "";
    }

    if (action === "TOGGLE_DOC") {
      const { docId, isReceived } = body;
      await db.update(requiredDocuments)
        .set({ isReceived, receivedAt: isReceived ? now : null })
        .where(eq(requiredDocuments.id, docId));
      return NextResponse.json({ success: true });
    }

    if (action === "ADVANCE_STAGE") {
      const newStage = (app.currentStage || 1) + 1;
      if (newStage > 5) return NextResponse.json({ error: "Already at max stage" }, { status: 400 });

      await db.update(marriageApplications)
        .set({ currentStage: newStage, updatedAt: now })
        .where(eq(marriageApplications.id, applicationId));

      const note = `Pendaftaran Anda telah dinaikkan ke Tahap ${newStage}: ${STAGE_NAMES[newStage - 1]}.`;

      // Log history
      await db.insert(stageHistory).values({
        id: nanoid(),
        applicationId,
        stageNumber: newStage,
        note,
        changedBy: adminId,
        changedAt: now
      });

      // Notify user (in-app)
      if (coupleUserId) {
        await db.insert(notifications).values({
          id: nanoid(),
          userId: coupleUserId,
          message: note,
          isRead: false,
          createdAt: now
        });
      }

      // Send email
      if (coupleEmail && coupleProfile) {
        sendStageAdvanceEmail({
          to: coupleEmail,
          name: coupleName,
          regNum: coupleProfile.registrationNumber || "",
          newStage,
          stageName: STAGE_NAMES[newStage - 1],
          note,
        }).catch(console.error);
      }

      return NextResponse.json({ success: true, newStage });
    }

    if (action === "SEND_NOTE") {
      const { note } = body;
      
      // Log history without changing stage
      await db.insert(stageHistory).values({
        id: nanoid(),
        applicationId,
        stageNumber: app.currentStage,
        note,
        changedBy: adminId,
        changedAt: now
      });

      // Notify user
      if (coupleUserId) {
        await db.insert(notifications).values({
          id: nanoid(),
          userId: coupleUserId,
          message: `Pesan baru dari sekretariat: "${note}"`,
          isRead: false,
          createdAt: now
        });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "CANCEL_APPLICATION") {
      const { note } = body;
      const cancelNote = `Pendaftaran dibatalkan: ${note}`;
      
      await db.update(marriageApplications)
        .set({ currentStage: 99, updatedAt: now })
        .where(eq(marriageApplications.id, applicationId));

      // Log history
      await db.insert(stageHistory).values({
        id: nanoid(),
        applicationId,
        stageNumber: 99,
        note: cancelNote,
        changedBy: adminId,
        changedAt: now
      });

      // Notify user (in-app)
      if (coupleUserId) {
        await db.insert(notifications).values({
          id: nanoid(),
          userId: coupleUserId,
          message: cancelNote,
          isRead: false,
          createdAt: now
        });
      }

      // Send cancellation email
      if (coupleEmail && coupleProfile) {
        sendCancellationEmail({
          to: coupleEmail,
          name: coupleName,
          regNum: coupleProfile.registrationNumber || "",
          reason: note,
        }).catch(console.error);
      }

      return NextResponse.json({ success: true });
    }

    if (action === "SET_WEDDING_DATE") {
      const { weddingDate } = body;
      await db.update(marriageApplications)
        .set({ weddingDate: weddingDate || null, updatedAt: now })
        .where(eq(marriageApplications.id, applicationId));

      // Notify couple (in-app)
      if (coupleUserId && weddingDate) {
        const dateStr = new Date(weddingDate).toLocaleDateString("id-ID", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        });
        const timeStr = weddingDate.includes("T") ? ` pukul ${weddingDate.substring(11, 16)} WIB` : "";
        await db.insert(notifications).values({
          id: nanoid(),
          userId: coupleUserId,
          message: `🎉 Jadwal Pemberkatan Anda telah ditetapkan: ${dateStr}${timeStr}. Selamat!`,
          isRead: false,
          createdAt: now,
        });
      }

      // Send ceremony email
      if (coupleEmail && coupleProfile && weddingDate) {
        sendCeremonyScheduleEmail({
          to: coupleEmail,
          name: coupleName,
          regNum: coupleProfile.registrationNumber || "",
          weddingDate,
        }).catch(console.error);
      }

      return NextResponse.json({ success: true });
    }

    if (action === "ASSIGN_PRIEST") {
      const { priestId } = body;
      await db.update(marriageApplications)
        .set({ priestId: priestId || null, updatedAt: now })
        .where(eq(marriageApplications.id, applicationId));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
