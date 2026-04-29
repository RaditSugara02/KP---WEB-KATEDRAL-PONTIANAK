import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { coupleProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "./profile-form";
import { User, Calendar, Phone, Church, Info } from "lucide-react";
import Link from "next/link";

export default async function ProfilPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  // Check if profile exists
  const profileRecord = await db.select().from(coupleProfiles)
    .where(eq(coupleProfiles.userId, session.user.id)).limit(1);
  const profile = profileRecord[0];

  // IF NO PROFILE: Show the form
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <ProfileForm />
      </div>
    );
  }

  // IF PROFILE EXISTS: Show Read-Only Data
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <Link 
          href="/dasbor/beranda" 
          className="inline-flex items-center gap-2 text-sm font-bold text-[#3D2B1F] bg-[#EDE8DF] hover:bg-[#DED7CB] transition-colors mb-6 px-4 py-2 rounded-lg"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Kembali ke Dasbor
        </Link>
        <h1 className="text-3xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Profil Pasangan
        </h1>
        <p className="text-[#6B6560]">
          Informasi data diri Anda dan pasangan yang terdaftar di Sekretariat Paroki.
        </p>
      </div>

      <div className="bg-[#EBF5FB] p-4 rounded-xl border border-[#AED6F1] flex gap-3">
        <Info className="text-[#2471A3] flex-shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-[#2471A3]">
          Data ini telah dikunci untuk keperluan administrasi pendaftaran. 
          Jika terdapat kesalahan penulisan nama atau tanggal lahir, silakan hubungi petugas Sekretariat Paroki secara langsung saat Anda menyerahkan dokumen fisik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KARTU MEMPELAI PRIA */}
        <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
          <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EDE8DF]">
            <h2 className="font-bold text-[#3D2B1F] flex items-center gap-2 uppercase tracking-wide text-sm">
              <User size={18} className="text-[#B8960C]" /> Mempelai Pria
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-wider mb-1">Nama Lengkap</p>
              <p className="font-semibold text-[#3D2B1F] text-lg">{profile.groomName}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#A89880]">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-wider mb-0.5">Tanggal Lahir</p>
                <p className="font-medium text-[#3D2B1F] text-sm">{formatDate(profile.groomBirthdate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#A89880]">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-wider mb-0.5">No. Telepon / WhatsApp</p>
                <p className="font-medium text-[#3D2B1F] text-sm">{profile.groomPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#A89880]">
                <Church size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-wider mb-0.5">Paroki Tempat Baptis</p>
                <p className="font-medium text-[#3D2B1F] text-sm">{profile.groomBaptismChurch}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KARTU MEMPELAI WANITA */}
        <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
          <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EDE8DF]">
            <h2 className="font-bold text-[#3D2B1F] flex items-center gap-2 uppercase tracking-wide text-sm">
              <User size={18} className="text-[#B8960C]" /> Mempelai Wanita
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-wider mb-1">Nama Lengkap</p>
              <p className="font-semibold text-[#3D2B1F] text-lg">{profile.brideName}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#A89880]">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-wider mb-0.5">Tanggal Lahir</p>
                <p className="font-medium text-[#3D2B1F] text-sm">{formatDate(profile.brideBirthdate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#A89880]">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-wider mb-0.5">No. Telepon / WhatsApp</p>
                <p className="font-medium text-[#3D2B1F] text-sm">{profile.bridePhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#A89880]">
                <Church size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-wider mb-0.5">Paroki Tempat Baptis</p>
                <p className="font-medium text-[#3D2B1F] text-sm">{profile.brideBaptismChurch}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden p-6 mt-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-wider mb-1">Rencana Tanggal Pemberkatan</p>
          <p className="font-semibold text-[#3D2B1F] text-lg">{formatDate(profile.plannedWeddingDate)}</p>
        </div>
        <div className="px-4 py-2 bg-[#FFF8E1] rounded-lg border border-[#B8960C]/20 text-center">
          <p className="text-[10px] font-bold text-[#B8960C] uppercase tracking-wider mb-0.5">Nomor Registrasi</p>
          <p className="font-bold text-[#3D2B1F]">{profile.registrationNumber}</p>
        </div>
      </div>
    </div>
  );
}
