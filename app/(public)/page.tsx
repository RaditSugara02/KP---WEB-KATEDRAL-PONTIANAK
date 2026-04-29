import { db } from "@/lib/db";
import { contents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Newspaper, BookOpen, MapPin, CalendarDays } from "lucide-react";

export default async function LandingPage() {
  // Fetch latest news
  const latestNews = await db.select()
    .from(contents)
    .where(eq(contents.type, "NEWS"))
    .orderBy(desc(contents.createdAt))
    .limit(3);

  return (
    <div className="flex flex-col">

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative h-[600px] md:h-[700px] w-full flex items-center justify-center overflow-hidden">
        <img
          alt="Eksterior Katedral Santo Yosef"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZmMfRH_S_YL6oasfS_wa1cjG3rJCzeedUhbwJVf6z3VoqLtpc2ue_bQaa7IMypXOmUrmcyyrL2BpDC-o5uSoh8_8MXK8BH7x7o2e-7pxa_OO5rtOI6SnhkrV2aWkYPeZ9uVd-IWquFbJjusKF-zIfWR6aHXgQ-1rp60Q7uJGEeRj_AOBg2k3nxXdYtT-1ILoRdkQfDRiUTDXZs3IUsULLIPF_GAnXOLT5IDQm3ssmxZ4mtzMkTbBk9pSF1Fsetp7DHctoRTu_QWw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center flex flex-col items-center">
          <span className="font-sans text-sm md:text-base tracking-[0.2em] text-[#B8960C] mb-4 uppercase font-semibold">
            Keuskupan Banjarmasin
          </span>
          <h1
            className="text-5xl md:text-7xl leading-tight text-white mb-6 font-bold"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Selamat Datang di Katedral <br className="hidden md:block" /> Santo Yosef Martapura
          </h1>
          <p className="font-sans text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed">
            Sebuah tempat perlindungan spiritual dan sejarah, mengundang Anda untuk merasakan kedamaian dan kebersamaan dalam iman.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/jadwal-misa"
              className="inline-flex items-center justify-center bg-[#B8960C] text-white px-8 py-3 rounded font-sans text-base font-medium hover:bg-[#9A7A00] transition-colors"
            >
              Lihat Jadwal Misa
            </Link>
            <Link
              href="/sakramen-perkawinan"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded font-sans text-base font-medium hover:bg-white/10 transition-colors"
            >
              Sakramen Perkawinan
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ QUICK INFORMATION CARDS ═══════════════════ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-16 relative z-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#2C1F14]/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-[#B8960C] h-6 w-6" />
              <h3 className="text-xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Jadwal Misa Hari Ini
              </h3>
            </div>
            <p className="text-[#3D2B1F]/70 text-sm leading-relaxed flex-grow">
              Informasi waktu pelaksanaan misa harian dan akhir pekan di Katedral.
            </p>
            <Link href="/jadwal-misa" className="text-[#B8960C] text-sm font-medium flex items-center gap-1 hover:underline">
              Lihat Selengkapnya <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#2C1F14]/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <Newspaper className="text-[#B8960C] h-6 w-6" />
              <h3 className="text-xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Berita Terbaru
              </h3>
            </div>
            <p className="text-[#3D2B1F]/70 text-sm leading-relaxed flex-grow">
              Pengumuman paroki, kegiatan umat, dan pesan gembala terkini.
            </p>
            <Link href="/berita" className="text-[#B8960C] text-sm font-medium flex items-center gap-1 hover:underline">
              Lihat Selengkapnya <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#2C1F14]/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="text-[#B8960C] h-6 w-6" />
              <h3 className="text-xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Panduan Sakramen
              </h3>
            </div>
            <p className="text-[#3D2B1F]/70 text-sm leading-relaxed flex-grow">
              Persyaratan dan langkah-langkah untuk menerima sakramen-sakramen gereja.
            </p>
            <Link href="/daftar" className="text-[#B8960C] text-sm font-medium flex items-center gap-1 hover:underline">
              Lihat Selengkapnya <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ JADWAL MISA PREVIEW ═══════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-sans text-sm tracking-[0.1em] text-[#B8960C] uppercase font-semibold">
              Peribadatan
            </span>
            <h2 className="text-4xl text-[#3D2B1F] mt-2 font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
              Jadwal Misa
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-[#2C1F14]/5">
            {/* Misa Harian */}
            <div>
              <h3 className="text-2xl text-[#B8960C] mb-6 border-b border-[#2C1F14]/10 pb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                Misa Harian
              </h3>
              <ul className="space-y-4 text-[#3D2B1F]">
                <li className="flex justify-between items-center">
                  <span className="font-medium">Senin - Jumat</span>
                  <span>05.30 WIB</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium">Jumat Pertama</span>
                  <span>18.00 WIB</span>
                </li>
              </ul>
            </div>
            {/* Misa Mingguan */}
            <div>
              <h3 className="text-2xl text-[#B8960C] mb-6 border-b border-[#2C1F14]/10 pb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                Misa Mingguan
              </h3>
              <ul className="space-y-4 text-[#3D2B1F]">
                <li className="flex justify-between items-center">
                  <span className="font-medium">Sabtu</span>
                  <span>18.00 WIB</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium">Minggu Pagi</span>
                  <span>06.00 &amp; 08.30 WIB</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium">Minggu Sore</span>
                  <span>16.00 &amp; 18.00 WIB</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/jadwal-misa" className="inline-flex items-center text-[#B8960C] font-medium hover:underline gap-2">
              Lihat Semua Jadwal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BERITA TERBARU ═══════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="font-sans text-sm tracking-[0.1em] text-[#B8960C] uppercase font-semibold">
                Informasi Paroki
              </span>
              <h2 className="text-4xl text-[#3D2B1F] mt-2 font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                Berita Terbaru
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.length > 0 ? (
              latestNews.map((news, index) => {
                const categoryLabels = ["Pengumuman", "Kegiatan", "Liturgi"];
                const bgColors = ["#d2c5b2", "#c5b5a1", "#b8a68f"];
                return (
                  <Link href={`/berita/${news.slug}`} key={news.id} className="group block">
                    <div className="bg-[#FAF7F2] rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow h-full">
                      <div className="h-48 relative" style={{ backgroundColor: bgColors[index % 3] }}>
                        {news.imageUrl ? (
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full h-full object-cover mix-blend-multiply opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Newspaper className="text-white/40" size={48} />
                          </div>
                        )}
                        <span className="absolute top-4 left-4 bg-white text-[#3D2B1F] text-xs font-bold px-2 py-1 rounded uppercase">
                          {categoryLabels[index % 3]}
                        </span>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <span className="text-[#3D2B1F]/60 text-sm mb-2">
                          {new Date(news.createdAt || new Date()).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <h3 className="text-xl text-[#3D2B1F] font-bold mb-3 line-clamp-2 group-hover:text-[#B8960C] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
                          {news.title}
                        </h3>
                        <span className="mt-auto text-[#B8960C] text-sm font-medium hover:underline inline-flex items-center">
                          Baca Selengkapnya
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              /* Placeholder cards if no news in DB */
              [
                { title: "Pendaftaran Katekumen Dewasa Periode 2024 Telah Dibuka", date: "12 Oktober 2023", label: "Pengumuman", bg: "#d2c5b2" },
                { title: "Aksi Sosial OMK Katedral dalam Rangka Bulan Rosario", date: "08 Oktober 2023", label: "Kegiatan", bg: "#c5b5a1" },
                { title: "Jadwal Pengakuan Dosa Menjelang Masa Adven", date: "05 Oktober 2023", label: "Liturgi", bg: "#b8a68f" },
              ].map((item, i) => (
                <div key={i} className="bg-[#FAF7F2] rounded-lg overflow-hidden flex flex-col shadow-sm">
                  <div className="h-48 relative" style={{ backgroundColor: item.bg }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="text-white/40" size={48} />
                    </div>
                    <span className="absolute top-4 left-4 bg-white text-[#3D2B1F] text-xs font-bold px-2 py-1 rounded uppercase">
                      {item.label}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[#3D2B1F]/60 text-sm mb-2">{item.date}</span>
                    <h3 className="text-xl text-[#3D2B1F] font-bold mb-3 line-clamp-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {item.title}
                    </h3>
                    <span className="mt-auto text-[#B8960C] text-sm font-medium inline-flex items-center">
                      Baca Selengkapnya
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════ AGENDA UMAT ═══════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] border-t border-[#2C1F14]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-sans text-sm tracking-[0.1em] text-[#B8960C] uppercase font-semibold">
              Kegiatan Mendatang
            </span>
            <h2 className="text-4xl text-[#3D2B1F] mt-2 font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
              Agenda Umat
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { bulan: "Okt", tanggal: "15", judul: "Rapat Dewan Pastoral", lokasi: "Aula Paroki" },
              { bulan: "Okt", tanggal: "22", judul: "Misa Orang Muda Katolik", lokasi: "Gereja Katedral" },
              { bulan: "Nov", tanggal: "01", judul: "Hari Raya Semua Orang Kudus", lokasi: "Pemakaman Katolik" },
            ].map((agenda, i) => (
              <div key={i} className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm border border-[#2C1F14]/5">
                <div className="text-center min-w-[60px] border-r border-[#2C1F14]/10 pr-4">
                  <span className="block font-sans text-sm text-[#B8960C] font-bold uppercase">{agenda.bulan}</span>
                  <span className="block text-3xl text-[#3D2B1F] font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {agenda.tanggal}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#3D2B1F] mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {agenda.judul}
                  </h4>
                  <p className="text-xs text-[#3D2B1F]/60 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {agenda.lokasi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PENGUMUMAN PERKAWINAN ═══════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="relative h-[400px] md:h-[500px] w-full">
            <img
              alt="Pernikahan di Katedral"
              className="w-full h-full object-cover rounded-lg shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR-_8bRb1Mt5tUrKEwh_3FL4PHLE7F_0e6zhDyYHxJyprN4Wz2jCXMt7O0baiJ3FPKXwZnUMLCGzF-ovWz9rcNFTX_vTtM9CeQtBMEg09IWSy-neg5Z9dZSSosjQ4jZwWT8SCvjTxzs33RQQm-Eh6UHoOMnIPEuAPeI1QPm222PbrchMIlEVQ2RsIlda3oVU5yP5j0WEfmetrtE8RPlVYaRjsKNBc_HQzM6kncfHqRqwI7FNV33bAlVcM8ASVrYbEh68Zj-QXJJjQ"
            />
          </div>
          {/* Text Column */}
          <div className="flex flex-col">
            <span className="font-sans text-sm tracking-widest text-[#B8960C] uppercase font-semibold mb-2">
              Sakramen Perkawinan
            </span>
            <h2 className="text-4xl md:text-5xl text-[#3D2B1F] mb-4 font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
              Pengumuman Perkawinan
            </h2>
            <p className="italic text-[#3D2B1F]/70 mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>
              Jika umat mengetahui adanya halangan perkawinan ini, wajib memberitahu pastor paroki.
            </p>
            <ul className="flex flex-col">
              {[
                { kali: "Diumumkan untuk pertama kali", pasangan: "Antonius Budi & Maria Claudia" },
                { kali: "Diumumkan untuk kedua kali", pasangan: "Yohanes Putra & Theresia Dewi" },
                { kali: "Diumumkan untuk ketiga kali", pasangan: "Stefanus Ari & Magdalena Sari" },
              ].map((item, i) => (
                <li key={i} className="py-4 border-b border-[#2C1F14]/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-[#3D2B1F]/70 text-sm">{item.kali}</span>
                  <span className="font-bold text-[#3D2B1F] text-base">{item.pasangan}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════ DONASI SECTION ═══════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
        <img
          alt="Katedral eksterior malam"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuByCUW2E10TvEaMTGU4wkasrC8LVmZhelnxuPEMUdl08pq4p9RYfDdquxGzLFnLWiaQHNo-IcrgknBpDTYTDuzLIp3RfZJbggwnIL6FacWugqEsVg-gXLf6XnwpSp0lYb50WypbH5MkPis7yQKscH-yPoHvkMhDzAP2rq04Wc2crtq1ihyqJOadK-ah-vWGFApj6gNM-d9EC3gdm0IwMZahS8gZlBfT9MfNPegdiN9StyBplOvz3EL30E8-eIP1yJTy4D6Ct63eRSg"
        />
        <div className="absolute inset-0 bg-[#2C1F14]/75" />
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <span className="font-sans text-sm tracking-widest text-white/80 uppercase font-semibold mb-4">
            Dukung Pelayanan Gereja
          </span>
          <h2 className="text-4xl md:text-5xl text-white mb-6 font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
            Donasi
          </h2>
          <p className="font-sans text-lg text-white/90 leading-relaxed mb-10">
            Setiap persembahan kasih yang Anda berikan akan menjadi saluran berkat yang menopang seluruh karya dan pelayanan gereja. Dukungan tulus dari Anda akan digunakan untuk kegiatan pastoral, pengembangan iman umat, serta pelayanan diakonia bagi mereka yang membutuhkan.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded font-sans text-base font-medium hover:bg-white/10 transition-colors"
          >
            Pelajari Lebih Lanjut →
          </a>
        </div>
      </section>

    </div>
  );
}
