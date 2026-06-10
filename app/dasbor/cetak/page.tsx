import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { coupleProfiles, marriageApplications, requiredDocuments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

const STAGE_NAMES = [
  "Pengisian Profil",
  "Kursus Persiapan Pernikahan (KPP)",
  "Pemberkasan Dokumen",
  "Penyelidikan Kanonik",
  "Pemberkatan Nikah",
];

export default async function CetakPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) notFound();

  const profileRecord = await db.select().from(coupleProfiles)
    .where(eq(coupleProfiles.userId, session.user.id)).limit(1);
  const profile = profileRecord[0];
  if (!profile) notFound();

  const appRecord = await db.select().from(marriageApplications)
    .where(eq(marriageApplications.coupleProfileId, profile.id)).limit(1);
  const application = appRecord[0];
  if (!application) notFound();

  const docs = await db.select().from(requiredDocuments)
    .where(eq(requiredDocuments.applicationId, application.id));

  const receivedDocs = docs.filter(d => d.isReceived).length;
  const stageName = application.currentStage === 99
    ? "DIBATALKAN"
    : STAGE_NAMES[(application.currentStage ?? 1) - 1];
  const printDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
    catch { return d; }
  };

  return (
    <>
      {/* Print Trigger — hanya muncul di browser, bukan di print */}
      <div className="no-print flex justify-center gap-3 p-6 bg-[#FAF7F2] border-b border-[#DDD8D0]">
        <button
          onClick={() => window.print()}
          className="px-8 py-3 bg-[#B8960C] text-white font-bold rounded-md hover:bg-[#9A7A00] transition-colors shadow text-sm"
          id="btn-print"
        >
          🖨️ Cetak / Simpan PDF
        </button>
        <a
          href="/dasbor/beranda"
          className="px-6 py-3 bg-white border border-[#DDD8D0] text-[#3D2B1F] font-bold rounded-md hover:bg-[#F5F0E8] transition-colors text-sm"
        >
          ← Kembali
        </a>
      </div>

      {/* Print Content */}
      <div className="print-area max-w-2xl mx-auto p-8 bg-white min-h-screen font-sans">

        {/* Header */}
        <div className="text-center border-b-2 border-[#3D2B1F] pb-6 mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-[#FFF8E1] border-2 border-[#B8960C] flex items-center justify-center text-3xl">
              ✝
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#3D2B1F] uppercase tracking-wide">
            Bukti Pendaftaran Pernikahan
          </h1>
          <p className="text-sm text-[#6B6560] mt-1">Paroki Katedral Santo Yosef Pontianak</p>
          <p className="text-xs text-[#A89880] mt-1">Dicetak pada: {printDate}</p>
        </div>

        {/* Registration Info */}
        <div className="bg-[#FFF8E1] border border-[#B8960C]/30 rounded-lg p-5 mb-6">
          <p className="text-xs font-bold text-[#A89880] uppercase tracking-wider mb-1">Nomor Registrasi</p>
          <p className="text-3xl font-bold text-[#B8960C] tracking-widest">{profile.registrationNumber}</p>
        </div>

        {/* Couple Data */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider border-b border-[#EDE8DF] pb-2 mb-4">
            Data Mempelai
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-[#A89880] uppercase font-bold tracking-wider mb-1">Calon Suami</p>
              <p className="font-bold text-[#3D2B1F]">{profile.groomName || "—"}</p>
              {profile.groomBirthdate && (
                <p className="text-sm text-[#6B6560]">{formatDate(profile.groomBirthdate)}</p>
              )}
              {profile.groomReligion && <p className="text-xs text-[#6B6560] mt-1">Agama: {profile.groomReligion}</p>}
              {profile.groomOccupation && <p className="text-xs text-[#6B6560]">Pekerjaan: {profile.groomOccupation}</p>}
              {profile.groomBaptismChurch && <p className="text-xs text-[#A89880] mt-1">Paroki: {profile.groomBaptismChurch}</p>}
              {profile.groomFatherName && <p className="text-xs text-[#6B6560] mt-1">Ayah: {profile.groomFatherName}</p>}
              {profile.groomMotherName && <p className="text-xs text-[#6B6560]">Ibu: {profile.groomMotherName}</p>}
            </div>
            <div>
              <p className="text-xs text-[#A89880] uppercase font-bold tracking-wider mb-1">Calon Isteri</p>
              <p className="font-bold text-[#3D2B1F]">{profile.brideName || "—"}</p>
              {profile.brideBirthdate && (
                <p className="text-sm text-[#6B6560]">{formatDate(profile.brideBirthdate)}</p>
              )}
              {profile.brideReligion && <p className="text-xs text-[#6B6560] mt-1">Agama: {profile.brideReligion}</p>}
              {profile.brideOccupation && <p className="text-xs text-[#6B6560]">Pekerjaan: {profile.brideOccupation}</p>}
              {profile.brideBaptismChurch && <p className="text-xs text-[#A89880] mt-1">Paroki: {profile.brideBaptismChurch}</p>}
              {profile.brideFatherName && <p className="text-xs text-[#6B6560] mt-1">Ayah: {profile.brideFatherName}</p>}
              {profile.brideMotherName && <p className="text-xs text-[#6B6560]">Ibu: {profile.brideMotherName}</p>}
            </div>
          </div>
        </div>

        {/* Informasi Perkawinan */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider border-b border-[#EDE8DF] pb-2 mb-4">
            Informasi Perkawinan
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#A89880] uppercase font-bold tracking-wider mb-1">Alamat Sesudah Perkawinan</p>
              <p className="text-[#3D2B1F]">{profile.postMarriageAddress || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-[#A89880] uppercase font-bold tracking-wider mb-1">Pilihan Misa</p>
              <p className="font-bold text-[#3D2B1F]">{profile.ceremonyType || "—"}</p>
            </div>
            {profile.preferredWeddingDate && (
              <div>
                <p className="text-xs text-[#A89880] uppercase font-bold tracking-wider mb-1">Preferensi Tanggal Pemberkatan</p>
                <p className="text-[#3D2B1F]">{formatDate(profile.preferredWeddingDate)}</p>
              </div>
            )}
            {profile.preferredWeddingTime && (
              <div>
                <p className="text-xs text-[#A89880] uppercase font-bold tracking-wider mb-1">Preferensi Jam</p>
                <p className="text-[#3D2B1F]">{profile.preferredWeddingTime} WIB</p>
              </div>
            )}
          </div>
        </div>

        {/* Application Status */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider border-b border-[#EDE8DF] pb-2 mb-4">
            Status Pendaftaran
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#A89880] uppercase font-bold tracking-wider mb-1">Tahap Saat Ini</p>
              <p className="font-bold text-[#3D2B1F]">
                {application.currentStage === 99 ? "DIBATALKAN" : `Tahap ${application.currentStage}`}: {stageName}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A89880] uppercase font-bold tracking-wider mb-1">Tanggal Daftar</p>
              <p className="font-bold text-[#3D2B1F]">
                {application.createdAt ? new Date(application.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              </p>
            </div>
            {application.weddingDate && (
              <div className="col-span-2">
                <p className="text-xs text-[#A89880] uppercase font-bold tracking-wider mb-1">Jadwal Pemberkatan</p>
                <p className="font-bold text-[#2D6A4F]">
                  {new Date(application.weddingDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  {application.weddingDate.includes("T") && ` · ${application.weddingDate.substring(11, 16)} WIB`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider border-b border-[#EDE8DF] pb-2 mb-4">
            Kelengkapan Dokumen ({receivedDocs}/{docs.length} diterima)
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 text-sm">
                <span className={`font-bold ${doc.isReceived ? "text-[#2D6A4F]" : "text-[#A89880]"}`}>
                  {doc.isReceived ? "✓" : "○"}
                </span>
                <span className={doc.isReceived ? "text-[#3D2B1F]" : "text-[#A89880]"}>
                  {doc.documentName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#3D2B1F] pt-6 text-center text-xs text-[#A89880]">
          <p className="mb-4">Dokumen ini merupakan bukti resmi pendaftaran pernikahan di Paroki Katedral Santo Yosef Pontianak.</p>
          <div className="flex justify-between items-end">
            <div className="text-left">
              <p>Sekretariat Paroki</p>
              <p className="mt-12 border-t border-[#A89880] pt-1 w-40">Tanda Tangan &amp; Cap</p>
            </div>
            <div className="text-right">
              <p>Pontianak, {printDate}</p>
              <p className="mt-12 border-t border-[#A89880] pt-1 w-40">Mempelai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles — only active during print */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { margin: 0; padding: 2cm; max-width: 100%; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @media screen {
          .print-area { border: 1px solid #EDE8DF; }
        }
      `}
      </style>

      {/* Auto-trigger print button on click via inline script */}
      <script dangerouslySetInnerHTML={{
        __html: `document.getElementById('btn-print')?.addEventListener('click', () => window.print());`
      }} />
    </>
  );
}
