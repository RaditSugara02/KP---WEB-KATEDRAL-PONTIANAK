import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  coupleProfiles, 
  marriageApplications,
  stageHistory,
  users
} from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Users, AlertCircle, CalendarHeart, FileCheck, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

const STAGE_NAMES = [
  "Profil",
  "KPP",
  "Dokumen",
  "Kanonik",
  "Selesai"
];

const STAGE_COLORS = [
  "bg-[#F0EFED] text-[#6B6560]", // Tahap 1
  "bg-[#EBF5FB] text-[#2471A3]", // Tahap 2
  "bg-[#FFF8E1] text-[#B8960C]", // Tahap 3
  "bg-[#FFF8E1] text-[#B8960C]", // Tahap 4
  "bg-[#D8F3DC] text-[#2D6A4F]", // Tahap 5
];

export default async function AdminRingkasanPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") return null;

  // Fetch all applications
  const allApps = await db.select({
    id: marriageApplications.id,
    currentStage: marriageApplications.currentStage,
    weddingDate: marriageApplications.weddingDate,
    regNum: coupleProfiles.registrationNumber,
    groom: coupleProfiles.groomName,
    bride: coupleProfiles.brideName,
    createdAt: marriageApplications.createdAt
  })
  .from(marriageApplications)
  .leftJoin(coupleProfiles, eq(marriageApplications.coupleProfileId, coupleProfiles.id))
  .orderBy(desc(marriageApplications.createdAt));

  // KPIs
  const totalAktif = allApps.length;
  const menungguTindakan = allApps.filter(a => a.currentStage === 1).length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const pemberkatanBulanIni = allApps.filter(a => {
    if (!a.weddingDate) return false;
    const date = new Date(a.weddingDate);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  // Recent History
  const recentHistory = await db.select({
    id: stageHistory.id,
    stage: stageHistory.stageNumber,
    note: stageHistory.note,
    createdAt: stageHistory.changedAt,
    userName: users.name
  })
  .from(stageHistory)
  .leftJoin(users, eq(stageHistory.changedBy, users.id))
  .orderBy(desc(stageHistory.changedAt))
  .limit(5);

  const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#3D2B1F] mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
            Selamat Datang, Sekretariat 👋
          </h1>
          <p className="text-[#6B6560] text-sm">{todayStr}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-[#DDD8D0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#3D2B1F] flex items-center justify-center flex-shrink-0 border border-[#EDE8DF]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-1">Total Pendaftar</p>
            <h3 className="text-2xl font-bold text-[#3D2B1F] leading-none">{totalAktif}</h3>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-[#DDD8D0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF8E1] text-[#B8960C] flex items-center justify-center flex-shrink-0 border border-[#B8960C]/20">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-1">Baru / Tahap 1</p>
            <h3 className="text-2xl font-bold text-[#B8960C] leading-none">{menungguTindakan}</h3>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-[#DDD8D0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#EBF5FB] text-[#2471A3] flex items-center justify-center flex-shrink-0 border border-[#2471A3]/20">
            <CalendarHeart size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-1">Pemberkatan Bulan Ini</p>
            <h3 className="text-2xl font-bold text-[#2471A3] leading-none">{pemberkatanBulanIni}</h3>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-[#DDD8D0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center flex-shrink-0 border border-[#2D6A4F]/20">
            <FileCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-1">Perlu Verifikasi</p>
            <h3 className="text-2xl font-bold text-[#2D6A4F] leading-none">0</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Table Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#EDE8DF] flex justify-between items-center bg-[#FAF7F2]">
              <h3 className="font-bold text-[#3D2B1F] uppercase tracking-wide text-sm">Pendaftaran Terbaru</h3>
              <Link href="/admin/pernikahan" className="text-xs font-bold text-[#B8960C] flex items-center hover:underline">
                Lihat Semua <ChevronRight size={14} />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#F5F0E8] text-[#6B6560] text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-semibold">No. Registrasi & Pasangan</th>
                    <th className="px-5 py-3 font-semibold">Tahap Saat Ini</th>
                    <th className="px-5 py-3 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE8DF]">
                  {allApps.slice(0, 5).map((app) => (
                    <tr key={app.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-bold text-[#B8960C] text-sm">{app.regNum || "—"}</p>
                        <p className="text-[#3D2B1F] font-medium mt-0.5">{app.groom?.split(" ")[0]} & {app.bride?.split(" ")[0]}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase rounded-full ${STAGE_COLORS[(app.currentStage || 1) - 1]}`}>
                          Tahap {app.currentStage}: {STAGE_NAMES[(app.currentStage || 1) - 1]}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Link 
                          href={`/admin/pernikahan/${app.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#DDD8D0] rounded text-xs font-semibold text-[#3D2B1F] hover:bg-[#F5F0E8] transition-colors"
                        >
                          Detail <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {allApps.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-[#6B6560]">Belum ada data pendaftaran.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm h-full flex flex-col">
            <div className="px-5 py-4 border-b border-[#EDE8DF] bg-[#FAF7F2]">
              <h3 className="font-bold text-[#3D2B1F] uppercase tracking-wide text-sm">Aktivitas Terbaru</h3>
            </div>
            
            <div className="p-5 flex-1">
              <div className="relative border-l-2 border-[#EDE8DF] ml-3 space-y-6">
                {recentHistory.map((hist, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-[#B8960C] rounded-full -left-[7px] top-1.5 border-2 border-white shadow-sm" />
                    <p className="text-xs text-[#A89880] mb-1">
                      {new Date(hist.createdAt || new Date()).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm font-medium text-[#3D2B1F] leading-snug mb-1">
                      {hist.userName}
                    </p>
                    <p className="text-xs text-[#6B6560] leading-relaxed">
                      {hist.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
