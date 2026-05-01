import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  coupleProfiles, 
  marriageApplications
} from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import PernikahanTableClient from "./PernikahanTableClient";

export default async function AdminPernikahanPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") return null;

  const allApps = await db.select({
    id: marriageApplications.id,
    currentStage: marriageApplications.currentStage,
    weddingDate: marriageApplications.weddingDate,
    regNum: coupleProfiles.registrationNumber,
    groom: coupleProfiles.groomName,
    bride: coupleProfiles.brideName,
    createdAt: marriageApplications.createdAt,
    isReregistration: marriageApplications.isReregistration,
  })
  .from(marriageApplications)
  .leftJoin(coupleProfiles, eq(marriageApplications.coupleProfileId, coupleProfiles.id))
  .orderBy(desc(marriageApplications.createdAt));

  // Serialize dates to strings for client component
  const serialized = allApps.map((a) => ({
    ...a,
    weddingDate: a.weddingDate ? String(a.weddingDate) : null,
    createdAt: a.createdAt ? a.createdAt.toISOString() : null,
    isReregistration: a.isReregistration ?? false,
  }));

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#3D2B1F] mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
            Data Pernikahan
          </h1>
          <p className="text-[#6B6560] text-sm">Kelola seluruh data pendaftaran calon pengantin.</p>
        </div>
      </div>

      {/* Client Component with Search + Filter + Table */}
      <PernikahanTableClient apps={serialized} />
    </div>
  );
}
