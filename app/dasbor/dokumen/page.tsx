import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { coupleProfiles, marriageApplications, requiredDocuments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CheckCircle2, Circle, AlertTriangle, FileText, Info } from "lucide-react";
import Link from "next/link";

export default async function DokumenPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  // Fetch Couple Profile & Application
  const profileRecord = await db.select().from(coupleProfiles)
    .where(eq(coupleProfiles.userId, session.user.id)).limit(1);
  const profile = profileRecord[0];

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20">
        <AlertTriangle size={48} className="text-[#A89880] mb-4" />
        <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>Profil Belum Dilengkapi</h2>
        <p className="text-[#6B6560] mb-6 text-center max-w-md">
          Anda harus melengkapi profil pendaftaran terlebih dahulu untuk melihat daftar kelengkapan dokumen.
        </p>
        <Link href="/dasbor/profil" className="px-6 py-2 bg-[#B8960C] text-white rounded-md font-bold hover:bg-[#9A7A00]">
          Lengkapi Profil
        </Link>
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
  const isComplete = receivedDocs === totalDocs && totalDocs > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Kelengkapan Dokumen
        </h1>
        <p className="text-[#6B6560]">
          Checklist dokumen persyaratan administrasi yang harus diserahkan ke Sekretariat Paroki.
        </p>
      </div>

      <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#EDE8DF] flex gap-4">
        <Info className="text-[#B8960C] flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-[#3D2B1F] text-sm mb-1">Informasi Penting</h3>
          <p className="text-sm text-[#6B6560]">
            Untuk menjamin keamanan dan keaslian data (seperti KTP dan Surat Baptis), sistem ini <strong>tidak menerima unggahan dokumen digital</strong>. 
            Silakan siapkan seluruh dokumen fisik di bawah ini dalam satu map, dan serahkan langsung ke Sekretariat Katedral Santo Yosef pada jam kerja. Admin akan mencentang sistem ini begitu berkas Anda diverifikasi.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EDE8DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="text-[#B8960C]" />
            <h2 className="font-bold text-[#3D2B1F] uppercase tracking-wide text-sm">Daftar Dokumen Fisik</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-[#6B6560] block font-semibold uppercase">Status Kelengkapan</span>
              <span className={`font-bold ${isComplete ? "text-[#2D6A4F]" : "text-[#B8960C]"}`}>
                {receivedDocs} dari {totalDocs} Selesai
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#EDE8DF]">
          {docs.length === 0 ? (
            <div className="p-8 text-center text-[#6B6560]">Daftar dokumen belum tersedia.</div>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="p-5 flex items-start sm:items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {doc.isReceived ? (
                      <CheckCircle2 className="text-[#2D6A4F]" />
                    ) : (
                      <Circle className="text-[#A89880]" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-medium ${doc.isReceived ? "text-[#3D2B1F]" : "text-[#6B6560]"}`}>
                      {doc.documentName}
                    </h4>
                    {doc.isReceived && doc.receivedAt && (
                      <p className="text-xs text-[#2D6A4F] mt-1">
                        Diverifikasi pada {new Date(doc.receivedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  {doc.isReceived ? (
                    <span className="inline-flex px-3 py-1 bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold rounded-full uppercase tracking-wider border border-[#B7E4C7]">
                      Sudah Diterima
                    </span>
                  ) : (
                    <span className="inline-flex px-3 py-1 bg-[#F5F0E8] text-[#A89880] text-xs font-bold rounded-full uppercase tracking-wider border border-[#DDD8D0]">
                      Belum Diserahkan
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
