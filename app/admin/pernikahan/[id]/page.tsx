import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  coupleProfiles, 
  marriageApplications,
  requiredDocuments,
  stageHistory,
  users
} from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DetailClient from "./DetailClient";

export default async function AdminPernikahanDetailPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") return null;

  const { id } = await params;

  // Fetch application
  const appRecord = await db.select({
    id: marriageApplications.id,
    currentStage: marriageApplications.currentStage,
    weddingDate: marriageApplications.weddingDate,
    priestId: marriageApplications.priestId,
    regNum: coupleProfiles.registrationNumber,
    groomName: coupleProfiles.groomName,
    groomBirthdate: coupleProfiles.groomBirthdate,
    groomPhone: coupleProfiles.groomPhone,
    groomBaptismChurch: coupleProfiles.groomBaptismChurch,
    brideName: coupleProfiles.brideName,
    brideBirthdate: coupleProfiles.brideBirthdate,
    bridePhone: coupleProfiles.bridePhone,
    brideBaptismChurch: coupleProfiles.brideBaptismChurch,
  })
  .from(marriageApplications)
  .leftJoin(coupleProfiles, eq(marriageApplications.coupleProfileId, coupleProfiles.id))
  .where(eq(marriageApplications.id, id))
  .limit(1);

  if (appRecord.length === 0) {
    return <div>Data tidak ditemukan.</div>;
  }

  const application = appRecord[0];

  // Fetch docs
  const docs = await db.select().from(requiredDocuments)
    .where(eq(requiredDocuments.applicationId, id));

  // Fetch history
  const history = await db.select().from(stageHistory)
    .where(eq(stageHistory.applicationId, id))
    .orderBy(desc(stageHistory.changedAt));

  // Fetch priests for assignment dropdown
  const priests = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.role, "PRIEST"));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Breadcrumb */}
      <div className="mb-6 border-b border-[#DDD8D0] pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/pernikahan" className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DDD8D0] rounded-full text-xs font-semibold text-[#6B6560] hover:bg-[#FAF7F2] transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <span className="text-xs text-[#A89880] uppercase tracking-wider font-semibold">
            Ringkasan / Daftar Pernikahan / Detail
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#3D2B1F] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
              {application.regNum} · {application.groomName?.split(" ")[0]} & {application.brideName?.split(" ")[0]}
            </h1>
            <div className="inline-flex items-center px-3 py-1 bg-[#FFF8E1] text-[#B8960C] text-xs font-bold uppercase rounded-full tracking-wider border border-[#B8960C]/20">
              Tahap {application.currentStage}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Client Component */}
      <DetailClient application={application} docs={docs} history={history} priests={priests} />

    </div>
  );
}
