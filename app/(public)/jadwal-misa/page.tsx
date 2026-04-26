import { db } from "@/lib/db";
import { contents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Clock, MapPin, AlertCircle } from "lucide-react";

export default async function JadwalMisaPage() {
  const allMasses = await db.select()
    .from(contents)
    .where(eq(contents.type, "MASS_SCHEDULE"));

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      
      {/* Header Kecil */}
      <div className="bg-[#F5F0E8] border-b border-[#DDD8D0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-[#A89880] uppercase tracking-wider mb-2 block">Beranda / Jadwal Misa</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Jadwal Misa
          </h1>
          <p className="text-[#6B6560] max-w-2xl mx-auto">
            Jadwal perayaan Ekaristi mingguan dan harian di Katedral Santo Yosef Martapura.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Banner Info */}
        <div className="bg-[#B8960C] text-white p-6 rounded-xl shadow-sm mb-12 flex items-start gap-4">
          <AlertCircle className="flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-1">Informasi Penting</h4>
            <p className="text-sm opacity-90 leading-relaxed">
              Jadwal di bawah ini merupakan jadwal misa reguler. Pada perayaan hari raya besar (Paskah, Natal, Pekan Suci), jadwal dapat berubah. Harap perhatikan pengumuman terbaru di halaman berita.
            </p>
          </div>
        </div>

        {/* Tab Navigasi Hari (Statis untuk UI) */}
        <div className="flex overflow-x-auto border-b border-[#DDD8D0] mb-8 no-scrollbar">
          {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((hari, i) => (
            <button 
              key={hari}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${
                hari === "Minggu" 
                  ? "bg-[#B8960C] text-white rounded-t-lg" 
                  : "text-[#6B6560] hover:text-[#B8960C] hover:bg-[#F5F0E8] rounded-t-lg"
              }`}
            >
              {hari}
            </button>
          ))}
        </div>

        {/* Grid Jadwal Minggu */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#3D2B1F] mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>Misa Hari Minggu</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Misa Indonesia */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-[#A89880] uppercase tracking-wider mb-4 border-b border-[#DDD8D0] pb-2">Misa Berbahasa Indonesia</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allMasses.slice(0,4).map((misa) => (
                  <div key={misa.id} className="bg-white p-6 rounded-xl border border-[#DDD8D0] shadow-sm flex gap-5 hover:border-[#B8960C] transition-colors">
                    <div className="text-3xl font-bold text-[#B8960C]" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {misa.eventDate}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3D2B1F] text-lg mb-1">{misa.title}</h4>
                      <p className="text-sm text-[#6B6560] mb-2">{misa.body}</p>
                      <div className="flex items-center gap-1.5 text-xs text-[#A89880] font-medium">
                        <MapPin size={14} />
                        {misa.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Khusus */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#A89880] uppercase tracking-wider mb-4 border-b border-[#DDD8D0] pb-2">Misa Khusus</h3>
              <div className="flex flex-col gap-4">
                {allMasses.slice(4,6).map((misa) => (
                  <div key={misa.id} className="bg-[#FAF7F2] p-6 rounded-xl border border-[#EDE8DF] flex gap-5">
                    <div className="text-3xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {misa.eventDate}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-[#3D2B1F] text-lg">{misa.title}</h4>
                      </div>
                      <p className="text-sm text-[#6B6560] mb-2">{misa.body}</p>
                      <div className="flex items-center gap-1.5 text-xs text-[#A89880] font-medium">
                        <MapPin size={14} />
                        {misa.location}
                      </div>
                    </div>
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
