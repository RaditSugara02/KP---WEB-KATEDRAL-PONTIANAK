"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export function ProfileForm() {
  const router = useRouter();

  // Onboarding Form States
  const [groomName, setGroomName] = useState("");
  const [groomBirthdate, setGroomBirthdate] = useState("");
  const [groomPhone, setGroomPhone] = useState("");
  const [groomBaptismChurch, setGroomBaptismChurch] = useState("Katedral Santo Yosef Martapura");
  
  const [brideName, setBrideName] = useState("");
  const [brideBirthdate, setBrideBirthdate] = useState("");
  const [bridePhone, setBridePhone] = useState("");
  const [brideBaptismChurch, setBrideBaptismChurch] = useState("Katedral Santo Yosef Martapura");
  
  const [groomPhoto, setGroomPhoto] = useState("");
  const [bridePhoto, setBridePhoto] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groomName, groomBirthdate, groomPhone, groomBaptismChurch, groomPhoto,
          brideName, brideBirthdate, bridePhone, brideBaptismChurch, bridePhoto
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan profil");
      }

      // Success, go to beranda
      router.push("/dasbor/beranda");
      router.refresh();
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan tak terduga");
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Mulai Pendaftaran
        </h1>
        <p className="text-[#6B6560]">
          Mohon isi data lengkap mempelai pria dan wanita sesuai dokumen resmi (KTP/Akte/Surat Baptis).
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#FDECEA] border border-[#C0392B]/30 text-[#C0392B] rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* DATA MEMPELAI PRIA */}
        <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
          <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EDE8DF]">
            <h2 className="font-bold text-[#3D2B1F] flex items-center gap-2 uppercase tracking-wide text-sm">
              <User size={18} className="text-[#B8960C]" /> Data Mempelai Pria
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Nama Lengkap (Sesuai KTP)</label>
              <input 
                type="text" required
                value={groomName} onChange={e => setGroomName(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#DDD8D0] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Tanggal Lahir</label>
              <input 
                type="date" required
                value={groomBirthdate} onChange={e => setGroomBirthdate(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#DDD8D0] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none text-[#3D2B1F]" 
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Nomor Telepon / WhatsApp</label>
              <input 
                type="tel" required
                value={groomPhone} onChange={e => setGroomPhone(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#DDD8D0] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Paroki Tempat Dibaptis</label>
              <input 
                type="text" required
                value={groomBaptismChurch} onChange={e => setGroomBaptismChurch(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#DDD8D0] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Pas Foto Berdampingan Pria (Boleh Pas Foto Sendiri)</label>
              <ImageUpload value={groomPhoto} onChange={setGroomPhoto} />
            </div>
          </div>
        </div>

        {/* DATA MEMPELAI WANITA */}
        <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
          <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EDE8DF]">
            <h2 className="font-bold text-[#3D2B1F] flex items-center gap-2 uppercase tracking-wide text-sm">
              <User size={18} className="text-[#B8960C]" /> Data Mempelai Wanita
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Nama Lengkap (Sesuai KTP)</label>
              <input 
                type="text" required
                value={brideName} onChange={e => setBrideName(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#DDD8D0] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Tanggal Lahir</label>
              <input 
                type="date" required
                value={brideBirthdate} onChange={e => setBrideBirthdate(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#DDD8D0] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none text-[#3D2B1F]" 
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Nomor Telepon / WhatsApp</label>
              <input 
                type="tel" required
                value={bridePhone} onChange={e => setBridePhone(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#DDD8D0] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Paroki Tempat Dibaptis</label>
              <input 
                type="text" required
                value={brideBaptismChurch} onChange={e => setBrideBaptismChurch(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#DDD8D0] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-bold text-[#6B6560] uppercase tracking-wider">Pas Foto Berdampingan Wanita (Boleh Pas Foto Sendiri)</label>
              <ImageUpload value={bridePhoto} onChange={setBridePhoto} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#DDD8D0]">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-[#B8960C] text-white font-bold rounded-md hover:bg-[#9A7A00] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan Data..." : "Simpan Profil & Lanjut ke Tahap 1"}
          </button>
        </div>
      </form>
    </div>
  );
}
