import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { coupleProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "./profile-form";
import { User, Calendar, Phone, Church, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProfilPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const profileRecord = await db.select().from(coupleProfiles)
    .where(eq(coupleProfiles.userId, session.user.id)).limit(1);
  const profile = profileRecord[0];

  if (!profile) {
    return <div className="max-w-4xl mx-auto"><ProfileForm /></div>;
  }

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
    catch { return d; }
  };

  const Field = ({ label, value }: { label: string; value: string | null }) => (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9C8B7A" }}>{label}</p>
      <p className="text-[15px] font-semibold" style={{ color: "#2C1F14" }}>{value || "—"}</p>
    </div>
  );

  const FieldIcon = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null }) => (
    <div className="flex items-center gap-3.5">
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#F5F0E8" }}>
        <Icon size={15} style={{ color: "#B8960C" }} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#9C8B7A" }}>{label}</p>
        <p className="text-[14px] font-medium" style={{ color: "#2C1F14" }}>{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5 page-fade">
      {/* Header */}
      <div className="mb-2">
        <Link href="/dasbor/beranda"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold mb-5 transition-colors hover:text-[#B8960C]"
          style={{ color: "#9C8B7A" }}>
          <ArrowLeft size={14} /> Kembali ke Dasbor
        </Link>
        <p className="section-label mb-2">Dasbor Pengantin</p>
        <h1 className="text-[32px] font-bold" style={{ fontFamily: "var(--font-cormorant)", color: "#2C1F14" }}>
          Profil Pasangan
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "#9C8B7A" }}>
          Informasi data diri yang terdaftar di Sekretariat Paroki.
        </p>
      </div>

      {/* Info Banner */}
      <div className="flex gap-3.5 p-4 rounded-xl" style={{ background: "#EAF0FA", border: "1px solid #A8BEDE" }}>
        <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#4A6FA5" }} />
        <p className="text-[13px] leading-relaxed" style={{ color: "#2E4E85" }}>
          Data ini dikunci untuk keperluan administrasi. Jika ada kesalahan, hubungi Sekretariat Paroki secara langsung saat menyerahkan dokumen fisik.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mempelai Pria */}
        <div className="card-sacred overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: "1px solid #E8E0D0", background: "#FDFBF8" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FDF3D0" }}>
              <User size={15} style={{ color: "#B8960C" }} />
            </div>
            <h2 className="font-bold text-[13px] uppercase tracking-wider" style={{ color: "#2C1F14" }}>Mempelai Pria</h2>
          </div>
          <div className="p-6 space-y-5">
            <Field label="Nama Lengkap" value={profile.groomName} />
            <FieldIcon icon={Calendar} label="Tanggal Lahir" value={formatDate(profile.groomBirthdate)} />
            <FieldIcon icon={Phone} label="No. Telepon / WhatsApp" value={profile.groomPhone} />
            <FieldIcon icon={Church} label="Paroki Tempat Baptis" value={profile.groomBaptismChurch} />
          </div>
        </div>

        {/* Mempelai Wanita */}
        <div className="card-sacred overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: "1px solid #E8E0D0", background: "#FDFBF8" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FDF3D0" }}>
              <User size={15} style={{ color: "#B8960C" }} />
            </div>
            <h2 className="font-bold text-[13px] uppercase tracking-wider" style={{ color: "#2C1F14" }}>Mempelai Wanita</h2>
          </div>
          <div className="p-6 space-y-5">
            <Field label="Nama Lengkap" value={profile.brideName} />
            <FieldIcon icon={Calendar} label="Tanggal Lahir" value={formatDate(profile.brideBirthdate)} />
            <FieldIcon icon={Phone} label="No. Telepon / WhatsApp" value={profile.bridePhone} />
            <FieldIcon icon={Church} label="Paroki Tempat Baptis" value={profile.brideBaptismChurch} />
          </div>
        </div>
      </div>

      {/* Wedding Date + Reg Number */}
      <div className="card-sacred p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#9C8B7A" }}>
            Rencana Tanggal Pemberkatan
          </p>
          <p className="text-[18px] font-bold" style={{ fontFamily: "var(--font-cormorant)", color: "#2C1F14" }}>
            {formatDate(profile.plannedWeddingDate)}
          </p>
        </div>
        <div className="px-5 py-3 rounded-xl text-center" style={{ background: "#FDF3D0", border: "1px solid #E8D070" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#B8960C" }}>
            Nomor Registrasi
          </p>
          <p className="font-bold text-[16px]" style={{ fontFamily: "var(--font-cormorant)", color: "#2C1F14" }}>
            {profile.registrationNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
