import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  coupleProfiles, 
  marriageApplications
} from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, Search, Filter } from "lucide-react";
import Link from "next/link";

const STAGE_NAMES = [
  "Pengisian Profil",
  "KPP",
  "Pemberkasan Dokumen",
  "Kanonik",
  "Selesai (Menunggu Pemberkatan)"
];

const STAGE_COLORS = [
  "bg-[#F0EFED] text-[#6B6560]", // Tahap 1
  "bg-[#EBF5FB] text-[#2471A3]", // Tahap 2
  "bg-[#FFF8E1] text-[#B8960C]", // Tahap 3
  "bg-[#FFF8E1] text-[#B8960C]", // Tahap 4
  "bg-[#D8F3DC] text-[#2D6A4F]", // Tahap 5
];

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
    createdAt: marriageApplications.createdAt
  })
  .from(marriageApplications)
  .leftJoin(coupleProfiles, eq(marriageApplications.coupleProfileId, coupleProfiles.id))
  .orderBy(desc(marriageApplications.createdAt));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#3D2B1F] mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
            Data Pernikahan
          </h1>
          <p className="text-[#6B6560] text-sm">Kelola seluruh data pendaftaran calon pengantin.</p>
        </div>
        <div>
          <button className="px-5 py-2.5 bg-[#B8960C] text-white font-bold text-sm rounded-md hover:bg-[#9A7A00] transition-colors shadow-sm">
            + Tambah Data Manual
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#DDD8D0] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89880]" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau no. registrasi..." 
            className="w-full h-10 pl-10 pr-4 text-sm border border-[#DDD8D0] rounded-md focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#DDD8D0] rounded-md text-sm font-semibold text-[#3D2B1F] hover:bg-[#FAF7F2]">
            <Filter size={16} className="text-[#A89880]" />
            Tahap
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#DDD8D0] rounded-md text-sm font-semibold text-[#3D2B1F] hover:bg-[#FAF7F2]">
            Bulan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F5F0E8] text-[#6B6560] text-xs uppercase tracking-wider border-b border-[#EDE8DF]">
              <tr>
                <th className="px-6 py-4 font-semibold">No. Registrasi & Pasangan</th>
                <th className="px-6 py-4 font-semibold">Tahap Saat Ini</th>
                <th className="px-6 py-4 font-semibold">Rencana Pemberkatan</th>
                <th className="px-6 py-4 font-semibold">Terdaftar Pada</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8DF]">
              {allApps.map((app) => {
                const stageNum = app.currentStage || 1;
                return (
                  <tr key={app.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#B8960C]">{app.regNum || "—"}</p>
                      <p className="text-[#3D2B1F] font-medium mt-1">{app.groom} & {app.bride}</p>
                    </td>
                    <td className="px-6 py-4">
                      {stageNum === 99 ? (
                        <span className="inline-flex px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-[#FDECEA] text-[#C0392B] border border-[#C0392B]/20">
                          Dibatalkan
                        </span>
                      ) : (
                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${STAGE_COLORS[stageNum - 1]}`}>
                          Tahap {stageNum}: {STAGE_NAMES[stageNum - 1]}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#6B6560]">
                      {app.weddingDate ? new Date(app.weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Belum ditentukan"}
                    </td>
                    <td className="px-6 py-4 text-[#6B6560]">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/pernikahan/${app.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#B8960C] rounded-md text-xs font-bold text-[#B8960C] hover:bg-[#FFF8E1] transition-colors"
                      >
                        Kelola <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {allApps.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B6560]">Belum ada data pendaftaran pernikahan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="px-6 py-4 border-t border-[#EDE8DF] bg-[#FAF7F2] flex items-center justify-between text-xs text-[#6B6560]">
          <span>Menampilkan {allApps.length} data</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 bg-white border border-[#DDD8D0] rounded text-[#A89880] cursor-not-allowed">Sebelumnya</button>
            <button className="px-3 py-1.5 bg-white border border-[#DDD8D0] rounded text-[#A89880] cursor-not-allowed">Selanjutnya</button>
          </div>
        </div>
      </div>

    </div>
  );
}
