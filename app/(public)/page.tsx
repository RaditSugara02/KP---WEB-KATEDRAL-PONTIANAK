import { db } from "@/lib/db";
import { contents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, CalendarDays, CheckCircle2, Church } from "lucide-react";

export default async function LandingPage() {
  // Fetch latest news
  const latestNews = await db.select()
    .from(contents)
    .where(eq(contents.type, "NEWS"))
    .orderBy(desc(contents.createdAt))
    .limit(3);

  // Fetch Mass schedules (for simplicity, we just fetch all and limit, in real app filter by today's day)
  const massSchedules = await db.select()
    .from(contents)
    .where(eq(contents.type, "MASS_SCHEDULE"))
    .limit(4);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-[#2C1F14] overflow-hidden">
        {/* Placeholder background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2B1F]/80 to-[#2C1F14] z-10" />
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548625361-ec853cb6ba84?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }} 
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 border border-[#B8960C] text-[#B8960C] text-xs font-bold uppercase tracking-widest rounded-full mb-6">
            Keuskupan Banjarmasin
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
            Katedral Santo Yosef <br className="hidden md:block" /> Martapura
          </h1>
          <p className="text-lg md:text-xl text-[#EDE8DF] mb-10 max-w-2xl mx-auto font-light italic">
            &quot;Menjadi komunitas umat beriman yang paguyuban, memasyarakat, dan berpusat pada Kristus.&quot;
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/daftar"
              className="w-full sm:w-auto px-8 py-4 bg-[#B8960C] text-white font-bold rounded hover:bg-[#9A7A00] transition-colors"
            >
              Daftar Pernikahan
            </Link>
            <Link 
              href="/jadwal-misa"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded hover:bg-white hover:text-[#2C1F14] transition-colors"
            >
              Lihat Jadwal Misa
            </Link>
          </div>
        </div>
      </section>

      {/* Jadwal Misa Section */}
      <section className="py-20 bg-[#F5F0E8] border-b border-[#DDD8D0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                Jadwal Misa Hari Ini
              </h2>
              <p className="text-[#6B6560]">Mari ikuti perayaan Ekaristi bersama di Katedral Santo Yosef.</p>
            </div>
            <Link href="/jadwal-misa" className="mt-4 md:mt-0 text-[#B8960C] font-bold flex items-center hover:underline">
              Lihat Jadwal Lengkap <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {massSchedules.map((misa) => (
              <div key={misa.id} className="bg-white p-6 rounded-xl shadow-sm border border-[#DDD8D0] hover:border-[#B8960C] transition-colors">
                <div className="text-3xl font-bold text-[#B8960C] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {misa.eventDate}
                </div>
                <h3 className="font-bold text-[#3D2B1F] text-lg mb-4">{misa.title}</h3>
                <div className="space-y-2 text-sm text-[#6B6560]">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#A89880]" />
                    <span>WITA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#A89880]" />
                    <span>{misa.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tahapan Pernikahan Section */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#B8960C] font-bold text-xs uppercase tracking-widest mb-2 block">Layanan Sakramen</span>
            <h2 className="text-4xl font-bold text-[#3D2B1F] mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
              Alur Pendaftaran Pernikahan
            </h2>
            <p className="text-[#6B6560] leading-relaxed">
              Kini mendaftar pernikahan di Katedral Santo Yosef menjadi lebih mudah dan transparan. Ikuti 5 tahapan berikut untuk mempersiapkan hari bahagia Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-[#EDE8DF] z-0" />

            {[
              { title: "Pengisian Profil", desc: "Buat akun dan lengkapi data diri calon pasangan." },
              { title: "Kursus KPP", desc: "Mengikuti Kursus Persiapan Pernikahan (KPP) wajib." },
              { title: "Pemberkasan", desc: "Serahkan 11 dokumen fisik ke sekretariat." },
              { title: "Kanonik", desc: "Penyelidikan kanonik bersama Romo paroki." },
              { title: "Pemberkatan", desc: "Penerimaan Sakramen Perkawinan." },
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-white p-6 rounded-xl border border-[#DDD8D0] shadow-sm text-center">
                <div className="w-12 h-12 mx-auto bg-[#B8960C] text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-sm" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {i + 1}
                </div>
                <h3 className="font-bold text-[#3D2B1F] mb-2">{step.title}</h3>
                <p className="text-xs text-[#6B6560]">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/daftar"
              className="inline-flex px-8 py-3 bg-[#B8960C] text-white font-bold rounded hover:bg-[#9A7A00] transition-colors"
            >
              Mulai Pendaftaran Anda
            </Link>
          </div>
        </div>
      </section>

      {/* Berita Terbaru */}
      <section className="py-20 bg-white border-t border-[#DDD8D0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                Berita & Pengumuman
              </h2>
              <p className="text-[#6B6560]">Informasi terbaru seputar kegiatan Paroki.</p>
            </div>
            <Link href="/berita" className="mt-4 md:mt-0 text-[#B8960C] font-bold flex items-center hover:underline">
              Lihat Semua Berita <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <Link href={`/berita/${news.slug}`} key={news.id} className="group block">
                <div className="bg-[#FAF7F2] rounded-xl overflow-hidden border border-[#DDD8D0] hover:border-[#B8960C] transition-all hover:shadow-md h-full flex flex-col">
                  {/* Thumbnail Placeholder */}
                  <div className="h-48 bg-[#EDE8DF] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#3D2B1F] opacity-10 group-hover:opacity-0 transition-opacity" />
                    {news.imageUrl ? (
                      <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#A89880]">
                        <Church size={48} opacity={0.5} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#B8960C] tracking-wider mb-2">Pengumuman</span>
                    <h3 className="font-bold text-[#3D2B1F] text-lg mb-3 group-hover:text-[#B8960C] transition-colors leading-snug">
                      {news.title}
                    </h3>
                    <p className="text-sm text-[#6B6560] line-clamp-2 mb-4 flex-1">
                      {news.body}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#A89880] mt-auto">
                      <CalendarDays size={14} />
                      <span>{new Date(news.createdAt || new Date()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
