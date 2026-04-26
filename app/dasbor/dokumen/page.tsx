import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  coupleProfiles, 
  marriageApplications, 
  requiredDocuments
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CheckCircle2, Circle, AlertCircle, UploadCloud } from "lucide-react";
import Link from "next/link";

export default async function DokumenDasborPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  // Fetch data
  const profileRecord = await db.select().from(coupleProfiles)
    .where(eq(coupleProfiles.userId, session.user.id)).limit(1);
  const profile = profileRecord[0];

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>Dokumen Persyaratan</h1>
        <p className="text-[#6B6560] mb-6">Anda harus mengisi profil calon pasangan terlebih dahulu sebelum dapat mengelola dokumen.</p>
        <Link href="/dasbor/profil" className="px-6 py-2 bg-[#B8960C] text-white rounded-md font-bold">Lengkapi Profil</Link>
      </div>
    );
  }

  const appRecord = await db.select().from(marriageApplications)
    .where(eq(marriageApplications.coupleProfileId, profile.id)).limit(1);
  const application = appRecord[0];

  const docs = await db.select().from(requiredDocuments)
    .where(eq(requiredDocuments.applicationId, application.id));

  const receivedDocs = docs.filter(d => d.isReceived).length;
  const totalDocs = docs.length;
  const progressPercent = totalDocs === 0 ? 0 : (receivedDocs / totalDocs) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Dokumen Persyaratan
        </h1>
        <p className="text-[#6B6560]">
          Kelola dan pantau kelengkapan dokumen persyaratan pernikahan Anda.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl border border-[#DDD8D0] shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h3 className="font-bold text-[#3D2B1F] uppercase tracking-wide text-sm">Status Kelengkapan</h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#2D6A4F]">{receivedDocs}</span>
            <span className="text-[#6B6560]"> dari {totalDocs} dokumen diterima</span>
          </div>
        </div>
        <div className="w-full h-3 bg-[#EDE8DF] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#2D6A4F] rounded-full transition-all duration-1000" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* Grid Dokumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <div key={doc.id} className="bg-white p-5 rounded-xl border border-[#DDD8D0] shadow-sm flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">
              {doc.isReceived ? (
                <div className="w-10 h-10 rounded-full bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#F5F0E8] text-[#A89880] flex items-center justify-center border border-[#DDD8D0]">
                  <Circle size={20} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-bold text-lg leading-tight mb-1 ${doc.isReceived ? "text-[#3D2B1F]" : "text-[#6B6560]"}`}>
                {doc.documentName}
              </h4>
              <div className="flex items-center justify-between mt-3">
                {doc.isReceived ? (
                  <span className="inline-block px-3 py-1 bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold uppercase rounded-full tracking-wider">
                    Diterima
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 bg-[#F5F0E8] text-[#6B6560] text-xs font-bold uppercase rounded-full tracking-wider">
                    Belum Diterima
                  </span>
                )}

                {!doc.isReceived && (
                  <button 
                    disabled
                    className="flex items-center gap-1 px-3 py-1.5 border-1.5 border-[#B8960C] text-[#B8960C] rounded text-xs font-medium hover:bg-[#FFF8E1] transition-colors opacity-50 cursor-not-allowed"
                    title="Fitur unggah digital segera hadir"
                  >
                    <UploadCloud size={14} />
                    Unggah
                  </button>
                )}
              </div>
              {doc.isReceived && doc.receivedAt && (
                <p className="text-[11px] text-[#A89880] mt-2 italic">
                  Diterima pada: {new Date(doc.receivedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-[#FFF8E1] p-5 rounded-xl border border-[#B8960C]/30 flex items-start gap-4 mt-8">
        <AlertCircle className="text-[#B8960C] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-[#B8960C] mb-1">Informasi Penyerahan Dokumen</h4>
          <p className="text-sm text-[#6B6560] leading-relaxed">
            Meskipun terdapat opsi unggah dokumen secara digital, **seluruh dokumen fisik asli/fotokopi wajib dibawa dan diserahkan langsung** ke Sekretariat Paroki Katedral Santo Yosef Martapura. Status kelengkapan di atas hanya akan berubah menjadi &quot;Diterima&quot; setelah petugas sekretariat memverifikasi dokumen fisik Anda.
          </p>
        </div>
      </div>

    </div>
  );
}
