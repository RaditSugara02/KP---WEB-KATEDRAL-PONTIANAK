import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  coupleProfiles, 
  marriageApplications, 
  requiredDocuments,
  stageHistory
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  FileText,
  ChevronRight,
  Printer
} from "lucide-react";

const STAGE_NAMES = [
  "Pengisian Profil",
  "Kursus Persiapan Pernikahan (KPP)",
  "Pemberkasan Dokumen",
  "Penyelidikan Kanonik",
  "Pemberkatan Nikah"
];

export default async function BerandaDasborPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;
  const user = session.user;

  // Fetch Couple Profile
  const profileRecord = await db.select().from(coupleProfiles)
    .where(eq(coupleProfiles.userId, user.id)).limit(1);
  const profile = profileRecord[0];

  // ==========================================
  // STATE: BELUM ADA PROFIL
  // ==========================================
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-4xl font-bold mb-2 text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Selamat datang, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-[#6B6560] mb-8">
          Saat ini Anda belum memiliki data pendaftaran pernikahan yang aktif.
        </p>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#B8960C] shadow-sm overflow-hidden">
          <div className="bg-[#FFF8E1] px-6 py-4 border-b border-[#B8960C]/20 flex items-center gap-3">
            <AlertCircle className="text-[#B8960C]" />
            <h3 className="font-bold text-[#B8960C]">Tindakan Diperlukan</h3>
          </div>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-cormorant)", color: "#3D2B1F" }}>
              Lengkapi Data Calon Pasangan
            </h2>
            <p className="text-[#6B6560] mb-8 max-w-lg mx-auto">
              Langkah pertama untuk mendaftar pernikahan di Katedral Santo Yosef adalah 
              melengkapi data diri mempelai pria dan wanita.
            </p>
            <Link 
              href="/dasbor/profil"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#B8960C] text-white font-bold rounded-md hover:bg-[#9A7A00] transition-colors"
            >
              Mulai Pendaftaran
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-bold mb-4 text-[#3D2B1F]">Alur Pendaftaran Pernikahan</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STAGE_NAMES.map((name, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-[#DDD8D0] text-center shadow-sm opacity-60">
                <div className="w-8 h-8 rounded-full bg-[#EDE8DF] text-[#6B6560] flex items-center justify-center font-bold mx-auto mb-3">
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-[#3D2B1F] leading-tight">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STATE: PROFIL SUDAH ADA (AKTIF)
  // ==========================================
  
  // Fetch App Data
  const appRecord = await db.select().from(marriageApplications)
    .where(eq(marriageApplications.coupleProfileId, profile.id)).limit(1);
  const application = appRecord[0];

  // Fetch ALL Stage History for Timeline
  const allHistory = await db.select().from(stageHistory)
    .where(eq(stageHistory.applicationId, application.id))
    .orderBy(desc(stageHistory.changedAt));
  const adminMessage = allHistory[0]?.note || "Berkas pendaftaran sedang ditinjau.";

  // Fetch Docs
  const docs = await db.select().from(requiredDocuments)
    .where(eq(requiredDocuments.applicationId, application.id));

  const receivedDocs = docs.filter(d => d.isReceived).length;
  const totalDocs = docs.length;

  const isCanceled = application.currentStage === 99;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Selamat datang, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-[#6B6560]">
            Pantau progres pendaftaran pernikahan Anda di bawah ini.
          </p>
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF8E1] border border-[#B8960C]/30 rounded-full">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#B8960C]">No. Registrasi:</span>
            <span className="font-bold text-[#3D2B1F]">{profile.registrationNumber}</span>
          </div>
          <Link
            href="/dasbor/cetak"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#DDD8D0] text-[#3D2B1F] font-semibold text-sm rounded-full hover:bg-[#F5F0E8] transition-colors"
          >
            <Printer size={14} className="text-[#A89880]" />
            Cetak Bukti
          </Link>
        </div>
        </div>
      </div>

      {/* Progress Steps UI */}
      <div className="bg-white p-6 rounded-xl border border-[#DDD8D0] shadow-sm mb-6 overflow-x-auto">
        <div className="flex items-center min-w-max justify-between px-4">
          {STAGE_NAMES.map((name, i) => {
            const stepNumber = i + 1;
            const isCompleted = stepNumber < application.currentStage;
            const isCurrent = stepNumber === application.currentStage;

            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center relative z-10 w-32">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${
                    isCompleted ? "bg-[#D8F3DC] border-[#2D6A4F] text-[#2D6A4F]" :
                    isCurrent ? "bg-[#B8960C] border-[#B8960C] text-white" :
                    "bg-[#F5F0E8] border-[#DDD8D0] text-[#A89880]"
                  }`}>
                    {isCompleted ? <CheckCircle2 size={20} /> : <span className="font-bold">{stepNumber}</span>}
                  </div>
                  <span className={`text-xs font-semibold text-center uppercase ${
                    isCompleted ? "text-[#2D6A4F]" :
                    isCurrent ? "text-[#B8960C]" :
                    "text-[#A89880]"
                  }`}>
                    {name}
                  </span>
                </div>
                {i < STAGE_NAMES.length - 1 && (
                  <div className={`w-16 h-1 -ml-4 -mr-4 rounded-full relative z-0 ${
                    stepNumber < application.currentStage ? "bg-[#2D6A4F]" : "bg-[#EDE8DF]"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isCanceled && (
        <div className="bg-[#FDECEA] p-6 rounded-xl border border-[#C0392B]/30 mb-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-[#C0392B]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle size={32} className="text-[#C0392B]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#C0392B] mb-2 uppercase tracking-wide">Pendaftaran Dibatalkan</h2>
            <p className="text-[#3D2B1F]">
              Proses pendaftaran pernikahan Anda telah dihentikan/dibatalkan oleh Sekretariat. 
              Pesan terakhir: <strong>&quot;{adminMessage}&quot;</strong>
            </p>
          </div>
        </div>
      )}

      {/* Jadwal Pemberkatan Banner */}
      {!isCanceled && application.weddingDate && (
        <div className="bg-gradient-to-r from-[#2D6A4F] to-[#1D4A35] text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-3xl">
            🎊
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">Jadwal Pemberkatan Nikah</p>
            <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
              {new Date(application.weddingDate).toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
              {application.weddingDate.includes("T") && (
                <span className="text-white/80 ml-2 text-base font-semibold">
                  · {application.weddingDate.substring(11, 16)} WIB
                </span>
              )}
            </h2>
            <p className="text-sm text-white/70 mt-1">Katedral Santo Yosef Martapura</p>
          </div>
          <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-center flex-shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-0.5">No. Registrasi</p>
            <p className="font-bold">{profile.registrationNumber}</p>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${isCanceled ? 'opacity-60 pointer-events-none' : ''}`}>
        
        {/* Kolom Kiri: Status & Pesan */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Kartu Tahap Aktif */}
          <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
            <div className="bg-[#FAF7F2] px-5 py-3 border-b border-[#EDE8DF]">
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wide">Status Saat Ini</h3>
            </div>
            <div className="p-5">
              <h4 className="text-xl font-bold text-[#B8960C] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                {isCanceled ? "DIBATALKAN" : `Tahap ${application.currentStage}: ${STAGE_NAMES[application.currentStage - 1]}`}
              </h4>
              <p className="text-sm text-[#6B6560]">
                {isCanceled && "Status pendaftaran ini sudah tidak aktif."}
                {!isCanceled && application.currentStage === 1 && "Profil Anda telah tersimpan. Silakan tunggu informasi jadwal KPP dari sekretariat."}
                {!isCanceled && application.currentStage === 2 && "Anda berada di tahap Kursus Persiapan Pernikahan. Pastikan Anda menghadiri kursus sesuai jadwal."}
                {!isCanceled && application.currentStage === 3 && "Silakan kumpulkan dokumen fisik ke sekretariat paroki."}
                {!isCanceled && application.currentStage === 4 && "Penyelidikan Kanonik sedang dijadwalkan bersama Romo."}
                {!isCanceled && application.currentStage === 5 && "Semua persiapan selesai! Menunggu hari pemberkatan."}
              </p>
            </div>
          </div>

          {/* Kartu Pesan Sekretariat */}
          <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#EDE8DF] flex items-center justify-between">
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wide">Pesan Sekretariat</h3>
              <Clock size={16} className="text-[#A89880]" />
            </div>
            <div className="p-5 border-l-4 border-[#2D6A4F] bg-[#FAF7F2]">
              <p className="text-sm text-[#3D2B1F] italic">&quot;{adminMessage}&quot;</p>
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Dokumen */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm h-full">
            <div className="px-5 py-4 border-b border-[#EDE8DF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#B8960C]" />
                <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wide">Kelengkapan Dokumen</h3>
              </div>
              <Link href="/dasbor/dokumen" className="text-sm text-[#B8960C] font-semibold flex items-center hover:underline">
                Lihat Detail <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-[#6B6560]">Progres Berkas</span>
                <span className="font-bold text-[#2D6A4F]">{receivedDocs} dari {totalDocs} diterima</span>
              </div>
              <div className="w-full h-2 bg-[#EDE8DF] rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500" 
                  style={{ width: `${(receivedDocs / totalDocs) * 100}%` }} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docs.slice(0, 8).map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3 p-3 rounded-lg border border-[#EDE8DF] bg-[#FAF7F2]">
                    <div className="mt-0.5 flex-shrink-0">
                      {doc.isReceived ? (
                        <CheckCircle2 size={18} className="text-[#2D6A4F]" />
                      ) : (
                        <Circle size={18} className="text-[#A89880]" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium leading-tight ${doc.isReceived ? "text-[#3D2B1F]" : "text-[#6B6560]"}`}>
                        {doc.documentName}
                      </p>
                      {doc.isReceived && (
                        <p className="text-[10px] text-[#2D6A4F] font-bold uppercase mt-1">DITERIMA</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {docs.length > 8 && (
                <div className="mt-4 text-center">
                  <span className="text-xs text-[#A89880] italic">
                    + {docs.length - 8} dokumen lainnya. Lihat detail untuk daftar lengkap.
                  </span>
                </div>
              )}

              <div className="mt-6 p-3 rounded bg-[#EBF5FB] text-[#2471A3] text-xs flex gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <p>Status dokumen diperbarui secara manual oleh sekretariat saat Anda menyerahkan berkas fisik ke kantor paroki.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Riwayat Tahap Timeline */}
      {allHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EDE8DF] flex items-center gap-2">
            <Clock size={16} className="text-[#B8960C]" />
            <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wide">Riwayat Perubahan Tahap</h3>
          </div>
          <div className="p-5">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-[#EDE8DF]" />
              <div className="space-y-5">
                {allHistory.map((h, i) => {
                  const isLast = i === allHistory.length - 1;
                  const date = h.changedAt
                    ? new Date(h.changedAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : "—";
                  const time = h.changedAt
                    ? new Date(h.changedAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit", minute: "2-digit",
                      })
                    : "";
                  const isCancelEntry = h.stageNumber === 99;
                  return (
                    <div key={i} className="flex gap-4 pl-2">
                      {/* Dot */}
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 z-10 flex items-center justify-center ${
                        i === 0
                          ? isCancelEntry
                            ? "bg-[#C0392B] border-[#C0392B]"
                            : "bg-[#B8960C] border-[#B8960C]"
                          : isLast
                          ? "bg-[#EDE8DF] border-[#DDD8D0]"
                          : "bg-[#D8F3DC] border-[#2D6A4F]"
                      }`}>
                        {i === 0 && !isCancelEntry && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isCancelEntry
                              ? "bg-[#FDECEA] text-[#C0392B]"
                              : "bg-[#FFF8E1] text-[#B8960C]"
                          }`}>
                            {isCancelEntry ? "Dibatalkan" : `Tahap ${h.stageNumber}`}
                          </span>
                          <span className="text-xs text-[#A89880]">{date} · {time}</span>
                        </div>
                        <p className="text-sm text-[#3D2B1F]">{h.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
