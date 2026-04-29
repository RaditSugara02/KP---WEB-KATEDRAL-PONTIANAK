import { db } from "@/lib/db";
import { contents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight, Calendar, Newspaper, BookOpen, MapPin, CalendarDays, ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default async function LandingPage() {
  // Fetch latest news
  const latestNews = await db.select()
    .from(contents)
    .where(eq(contents.type, "NEWS"))
    .orderBy(desc(contents.createdAt))
    .limit(3);

  return (
    <div className="flex flex-col bg-transparent">

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            alt="Eksterior Katedral Santo Yosef"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZmMfRH_S_YL6oasfS_wa1cjG3rJCzeedUhbwJVf6z3VoqLtpc2ue_bQaa7IMypXOmUrmcyyrL2BpDC-o5uSoh8_8MXK8BH7x7o2e-7pxa_OO5rtOI6SnhkrV2aWkYPeZ9uVd-IWquFbJjusKF-zIfWR6aHXgQ-1rp60Q7uJGEeRj_AOBg2k3nxXdYtT-1ILoRdkQfDRiUTDXZs3IUsULLIPF_GAnXOLT5IDQm3ssmxZ4mtzMkTbBk9pSF1Fsetp7DHctoRTu_QWw"
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C1F14]/70 via-[#2C1F14]/50 to-[#FAF7F2]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center flex flex-col items-center mt-20">
          <ScrollReveal direction="up" delay={100} duration={1000}>
            <span className="font-sans text-xs md:text-sm tracking-[0.3em] text-[#B8960C] mb-6 uppercase font-bold inline-block border-b border-[#B8960C]/30 pb-2">
              Keuskupan Banjarmasin
            </span>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={300} duration={1200}>
            <h1
              className="text-6xl md:text-8xl leading-[1.1] text-white mb-8 font-bold drop-shadow-lg"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Selamat Datang di<br className="hidden md:block" /> Katedral Santo Yosef<br className="hidden md:block" /> Martapura
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={500} duration={1000}>
            <p className="font-light text-lg md:text-2xl text-white/90 max-w-3xl mb-12 leading-relaxed drop-shadow">
              Sebuah tempat perlindungan spiritual dan sejarah, mengundang Anda untuk merasakan kedamaian dan kebersamaan dalam iman.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={700} duration={1000}>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/jadwal-misa"
                className="group relative inline-flex items-center justify-center bg-[#B8960C] text-white px-10 py-4 rounded-sm font-sans text-sm tracking-wide font-semibold hover:bg-[#9A7A00] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Lihat Jadwal Misa
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sakramen-perkawinan"
                className="group inline-flex items-center justify-center bg-transparent border border-white/50 text-white px-10 py-4 rounded-sm font-sans text-sm tracking-wide font-semibold hover:bg-white hover:text-[#3D2B1F] transition-all duration-300"
              >
                Sakramen Perkawinan
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ QUICK INFORMATION CARDS ═══════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-24 md:-mt-32 relative z-20 w-full mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Card 1 */}
          <ScrollReveal delay={100} className="h-full">
            <div className="bg-white p-10 rounded-2xl shadow-elegant border border-white/60 flex flex-col h-full group hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm">
              <div className="w-14 h-14 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#B8960C] transition-colors duration-500">
                <Calendar className="text-[#B8960C] h-6 w-6 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                Jadwal Misa Hari Ini
              </h3>
              <p className="text-[#6B6560] text-base leading-relaxed flex-grow font-light mb-8">
                Informasi waktu pelaksanaan misa harian dan akhir pekan di Katedral.
              </p>
              <Link href="/jadwal-misa" className="text-[#B8960C] text-sm font-bold tracking-wider uppercase flex items-center gap-2 group/link w-fit">
                Lihat Selengkapnya <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
          
          {/* Card 2 */}
          <ScrollReveal delay={200} className="h-full">
            <div className="bg-white p-10 rounded-2xl shadow-elegant border border-white/60 flex flex-col h-full group hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm">
              <div className="w-14 h-14 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#B8960C] transition-colors duration-500">
                <Newspaper className="text-[#B8960C] h-6 w-6 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                Berita Terbaru
              </h3>
              <p className="text-[#6B6560] text-base leading-relaxed flex-grow font-light mb-8">
                Pengumuman paroki, kegiatan umat, dan pesan gembala terkini.
              </p>
              <Link href="/berita" className="text-[#B8960C] text-sm font-bold tracking-wider uppercase flex items-center gap-2 group/link w-fit">
                Lihat Selengkapnya <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal delay={300} className="h-full">
            <div className="bg-white p-10 rounded-2xl shadow-elegant border border-white/60 flex flex-col h-full group hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm">
              <div className="w-14 h-14 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#B8960C] transition-colors duration-500">
                <BookOpen className="text-[#B8960C] h-6 w-6 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                Panduan Sakramen
              </h3>
              <p className="text-[#6B6560] text-base leading-relaxed flex-grow font-light mb-8">
                Persyaratan dan langkah-langkah untuk menerima sakramen gereja.
              </p>
              <Link href="/daftar" className="text-[#B8960C] text-sm font-bold tracking-wider uppercase flex items-center gap-2 group/link w-fit">
                Lihat Selengkapnya <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ JADWAL MISA PREVIEW ═══════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16 flex flex-col items-center">
              <div className="h-12 w-px bg-[#B8960C]/50 mb-6" />
              <span className="font-sans text-xs tracking-[0.25em] text-[#B8960C] uppercase font-bold mb-4">
                Peribadatan
              </span>
              <h2 className="text-5xl text-[#3D2B1F] font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                Jadwal Misa Katedral
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-5xl mx-auto bg-white rounded-2xl shadow-elegant overflow-hidden">
              {/* Misa Harian */}
              <div className="p-12 border-b md:border-b-0 md:border-r border-[#EDE8DF] relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#B8960C]/20" />
                <h3 className="text-3xl text-[#3D2B1F] mb-8 font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Misa Harian
                </h3>
                <ul className="space-y-6">
                  <li className="flex justify-between items-center group">
                    <span className="font-medium text-[#6B6560] group-hover:text-[#3D2B1F] transition-colors">Senin - Jumat</span>
                    <span className="font-semibold text-[#B8960C] bg-[#FFF8E1] px-4 py-1.5 rounded-full text-sm">05.30 WIB</span>
                  </li>
                  <li className="flex justify-between items-center group">
                    <span className="font-medium text-[#6B6560] group-hover:text-[#3D2B1F] transition-colors">Jumat Pertama</span>
                    <span className="font-semibold text-[#B8960C] bg-[#FFF8E1] px-4 py-1.5 rounded-full text-sm">18.00 WIB</span>
                  </li>
                </ul>
              </div>
              
              {/* Misa Mingguan */}
              <div className="p-12 relative">
                <div className="absolute top-0 right-0 w-1 h-full bg-[#B8960C]" />
                <h3 className="text-3xl text-[#3D2B1F] mb-8 font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Misa Mingguan
                </h3>
                <ul className="space-y-6">
                  <li className="flex justify-between items-center group">
                    <span className="font-medium text-[#6B6560] group-hover:text-[#3D2B1F] transition-colors">Sabtu</span>
                    <span className="font-semibold text-[#B8960C] bg-[#FFF8E1] px-4 py-1.5 rounded-full text-sm">18.00 WIB</span>
                  </li>
                  <li className="flex justify-between items-center group">
                    <span className="font-medium text-[#6B6560] group-hover:text-[#3D2B1F] transition-colors">Minggu Pagi</span>
                    <span className="font-semibold text-[#B8960C] bg-[#FFF8E1] px-4 py-1.5 rounded-full text-sm">06.00 &amp; 08.30 WIB</span>
                  </li>
                  <li className="flex justify-between items-center group">
                    <span className="font-medium text-[#6B6560] group-hover:text-[#3D2B1F] transition-colors">Minggu Sore</span>
                    <span className="font-semibold text-[#B8960C] bg-[#FFF8E1] px-4 py-1.5 rounded-full text-sm">16.00 &amp; 18.00 WIB</span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="text-center mt-12">
              <Link href="/jadwal-misa" className="inline-flex items-center justify-center bg-transparent border border-[#3D2B1F] text-[#3D2B1F] px-8 py-3 rounded-sm font-sans text-sm tracking-wide font-semibold hover:bg-[#3D2B1F] hover:text-white transition-all duration-300">
                Lihat Semua Jadwal
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ BERITA TERBARU ═══════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-px bg-gradient-to-r from-transparent via-[#DDD8D0] to-transparent max-w-7xl" />
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="font-sans text-xs tracking-[0.25em] text-[#B8960C] uppercase font-bold mb-4 block">
                  Informasi Paroki
                </span>
                <h2 className="text-5xl text-[#3D2B1F] font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Berita Terbaru
                </h2>
              </div>
              <Link href="/berita" className="text-[#3D2B1F] font-medium hover:text-[#B8960C] transition-colors flex items-center gap-2 pb-2 border-b border-[#3D2B1F] hover:border-[#B8960C]">
                Semua Berita <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestNews.length > 0 ? (
              latestNews.map((news, index) => {
                const categoryLabels = ["Pengumuman", "Kegiatan", "Liturgi"];
                return (
                  <ScrollReveal key={news.id} delay={index * 150} className="h-full">
                    <Link href={`/berita/${news.slug}`} className="group block h-full">
                      <div className="bg-transparent flex flex-col h-full cursor-pointer">
                        <div className="h-64 relative rounded-xl overflow-hidden mb-6 bg-[#F5F0E8]">
                          {news.imageUrl ? (
                            <img
                              src={news.imageUrl}
                              alt={news.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#EDE8DF]">
                              <Newspaper className="text-[#B8960C]/40" size={48} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="absolute top-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-sm text-[#3D2B1F] text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm">
                            {categoryLabels[index % 3]}
                          </span>
                        </div>
                        <div className="flex flex-col flex-grow">
                          <span className="text-[#B8960C] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                            <span className="w-4 h-px bg-[#B8960C]"></span>
                            {new Date(news.createdAt || new Date()).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <h3 className="text-2xl text-[#3D2B1F] font-bold leading-snug mb-4 line-clamp-3 group-hover:text-[#B8960C] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
                            {news.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })
            ) : (
              /* Placeholder cards if no news in DB */
              [
                { title: "Pendaftaran Katekumen Dewasa Periode 2024 Telah Dibuka", date: "12 Oktober 2023", label: "Pengumuman" },
                { title: "Aksi Sosial OMK Katedral dalam Rangka Bulan Rosario", date: "08 Oktober 2023", label: "Kegiatan" },
                { title: "Jadwal Pengakuan Dosa Menjelang Masa Adven", date: "05 Oktober 2023", label: "Liturgi" },
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 150} className="h-full">
                  <div className="bg-transparent flex flex-col h-full cursor-pointer group">
                    <div className="h-64 relative rounded-xl overflow-hidden mb-6 bg-[#F5F0E8]">
                      <div className="w-full h-full flex items-center justify-center bg-[#EDE8DF] transition-transform duration-700 group-hover:scale-105">
                        <Newspaper className="text-[#B8960C]/40" size={48} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute top-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-sm text-[#3D2B1F] text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <span className="text-[#B8960C] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                        <span className="w-4 h-px bg-[#B8960C]"></span>
                        {item.date}
                      </span>
                      <h3 className="text-2xl text-[#3D2B1F] font-bold leading-snug mb-4 line-clamp-3 group-hover:text-[#B8960C] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════ AGENDA UMAT ═══════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16 flex flex-col items-center">
              <div className="h-12 w-px bg-[#B8960C]/50 mb-6" />
              <span className="font-sans text-xs tracking-[0.25em] text-[#B8960C] uppercase font-bold mb-4">
                Kegiatan Mendatang
              </span>
              <h2 className="text-5xl text-[#3D2B1F] font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                Agenda Umat
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { bulan: "Okt", tanggal: "15", judul: "Rapat Dewan Pastoral", lokasi: "Aula Paroki" },
              { bulan: "Okt", tanggal: "22", judul: "Misa Orang Muda Katolik", lokasi: "Gereja Katedral" },
              { bulan: "Nov", tanggal: "01", judul: "Hari Raya Semua Orang Kudus", lokasi: "Pemakaman Katolik" },
            ].map((agenda, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="bg-white rounded-xl p-6 flex items-center gap-6 shadow-sm border border-transparent hover:border-[#B8960C]/30 hover:shadow-elegant transition-all duration-300 group">
                  <div className="text-center min-w-[70px] flex flex-col items-center justify-center">
                    <span className="block font-sans text-xs text-[#B8960C] font-bold uppercase tracking-wider mb-1">{agenda.bulan}</span>
                    <span className="block text-4xl text-[#3D2B1F] font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {agenda.tanggal}
                    </span>
                  </div>
                  <div className="w-px h-16 bg-[#EDE8DF]" />
                  <div>
                    <h4 className="text-xl font-bold text-[#3D2B1F] mb-2 group-hover:text-[#B8960C] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {agenda.judul}
                    </h4>
                    <p className="text-sm text-[#6B6560] font-light flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#B8960C]" /> {agenda.lokasi}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PENGUMUMAN PERKAWINAN ═══════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <ScrollReveal direction="right" duration={1000} className="w-full order-2 lg:order-1">
            <div className="relative h-[500px] lg:h-[650px] w-full rounded-2xl overflow-hidden shadow-elegant group">
              <img
                alt="Pernikahan di Katedral"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR-_8bRb1Mt5tUrKEwh_3FL4PHLE7F_0e6zhDyYHxJyprN4Wz2jCXMt7O0baiJ3FPKXwZnUMLCGzF-ovWz9rcNFTX_vTtM9CeQtBMEg09IWSy-neg5Z9dZSSosjQ4jZwWT8SCvjTxzs33RQQm-Eh6UHoOMnIPEuAPeI1QPm222PbrchMIlEVQ2RsIlda3oVU5yP5j0WEfmetrtE8RPlVYaRjsKNBc_HQzM6kncfHqRqwI7FNV33bAlVcM8ASVrYbEh68Zj-QXJJjQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1F14]/60 via-transparent to-transparent" />
            </div>
          </ScrollReveal>
          
          {/* Text Column */}
          <ScrollReveal direction="left" duration={1000} className="flex flex-col order-1 lg:order-2">
            <span className="font-sans text-xs tracking-[0.25em] text-[#B8960C] uppercase font-bold mb-4">
              Sakramen Perkawinan
            </span>
            <h2 className="text-5xl lg:text-6xl text-[#3D2B1F] mb-6 font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
              Pengumuman Perkawinan
            </h2>
            <p className="text-[#6B6560] text-lg font-light leading-relaxed mb-4">
              Pemberitahuan kepada umat mengenai rencana sakramen perkawinan dari calon mempelai. 
            </p>
            <p className="italic text-[#B8960C] mb-10 text-base" style={{ fontFamily: "var(--font-cormorant)" }}>
              * Jika umat mengetahui adanya halangan perkawinan ini, wajib memberitahu pastor paroki.
            </p>
            
            <ul className="flex flex-col space-y-6">
              {[
                { kali: "Pengumuman Pertama", pasangan: "Antonius Budi & Maria Claudia" },
                { kali: "Pengumuman Kedua", pasangan: "Yohanes Putra & Theresia Dewi" },
                { kali: "Pengumuman Ketiga", pasangan: "Stefanus Ari & Magdalena Sari" },
              ].map((item, i) => (
                <li key={i} className="pb-6 border-b border-[#EDE8DF] flex flex-col md:flex-row md:items-center justify-between gap-2 group">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#F5F0E8] text-[#B8960C] flex items-center justify-center font-bold text-sm" style={{ fontFamily: "var(--font-cormorant)" }}>{i + 1}</span>
                    <span className="text-[#6B6560] text-sm uppercase tracking-wider font-bold">{item.kali}</span>
                  </div>
                  <span className="font-bold text-[#3D2B1F] text-xl md:text-right group-hover:text-[#B8960C] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>{item.pasangan}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-10">
              <Link href="/daftar" className="inline-flex items-center text-[#B8960C] font-bold tracking-wider uppercase text-sm hover:underline gap-2">
                Informasi Pendaftaran Perkawinan <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ DONASI SECTION ═══════════════════ */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            alt="Katedral eksterior malam"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuByCUW2E10TvEaMTGU4wkasrC8LVmZhelnxuPEMUdl08pq4p9RYfDdquxGzLFnLWiaQHNo-IcrgknBpDTYTDuzLIp3RfZJbggwnIL6FacWugqEsVg-gXLf6XnwpSp0lYb50WypbH5MkPis7yQKscH-yPoHvkMhDzAP2rq04Wc2crtq1ihyqJOadK-ah-vWGFApj6gNM-d9EC3gdm0IwMZahS8gZlBfT9MfNPegdiN9StyBplOvz3EL30E8-eIP1yJTy4D6Ct63eRSg"
          />
          <div className="absolute inset-0 bg-[#2C1F14]/85" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <ScrollReveal direction="up" delay={100}>
            <span className="font-sans text-xs tracking-[0.25em] text-[#B8960C] uppercase font-bold mb-6 block">
              Dukung Pelayanan Gereja
            </span>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-5xl md:text-7xl text-white mb-8 font-bold drop-shadow-md" style={{ fontFamily: "var(--font-cormorant)" }}>
              Persembahan Kasih
            </h2>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={300}>
            <p className="font-light text-lg md:text-xl text-[#EDE8DF] leading-relaxed mb-12 drop-shadow">
              Setiap persembahan kasih yang Anda berikan akan menjadi saluran berkat yang menopang seluruh karya dan pelayanan gereja. Dukungan tulus dari Anda akan digunakan untuk kegiatan pastoral, pengembangan iman umat, serta pelayanan diakonia bagi mereka yang membutuhkan.
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={400}>
            <a
              href="#"
              className="inline-flex items-center justify-center bg-[#B8960C] border border-[#B8960C] text-white px-10 py-4 rounded-sm font-sans text-sm tracking-wide font-semibold hover:bg-transparent hover:text-[#B8960C] transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </a>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
