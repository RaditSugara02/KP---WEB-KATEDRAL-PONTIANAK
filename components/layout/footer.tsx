import Link from "next/link";
import { Church, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#3D2B1F] text-[#FAF7F2] pt-16 md:pt-24 pb-10 md:pb-12 border-t border-[#B8960C]/30 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8960C]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col">
            <Link href="/" className="flex items-center gap-4 mb-6 group inline-flex w-fit">
              <div className="w-12 h-12 rounded-full bg-[#B8960C] text-white flex items-center justify-center shadow-lg group-hover:bg-[#9A7A00] transition-colors">
                <Church size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-white leading-none tracking-wide" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Katedral
                </span>
                <span className="text-xs uppercase tracking-[0.25em] text-[#B8960C] font-semibold mt-1.5">Santo Yosef</span>
              </div>
            </Link>
            <p className="text-[#EDE8DF]/80 text-base leading-relaxed mb-8 max-w-sm font-light">
              Menjadi komunitas umat beriman yang paguyuban, memasyarakat, dan berpusat pada Kristus.
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-[0.15em] text-xs mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>Navigasi</h4>
            <ul className="space-y-4 text-sm text-[#EDE8DF]/80">
              <li><Link href="/" className="hover:text-[#B8960C] transition-colors inline-block hover:translate-x-1 transform duration-300">Beranda</Link></li>
              <li><Link href="/jadwal-misa" className="hover:text-[#B8960C] transition-colors inline-block hover:translate-x-1 transform duration-300">Jadwal Misa</Link></li>
              <li><Link href="/berita" className="hover:text-[#B8960C] transition-colors inline-block hover:translate-x-1 transform duration-300">Berita Paroki</Link></li>
              <li><Link href="/daftar" className="hover:text-[#B8960C] transition-colors inline-block hover:translate-x-1 transform duration-300">Sakramen</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <h4 className="text-white font-bold uppercase tracking-[0.15em] text-xs mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>Layanan Paroki</h4>
            <ul className="space-y-4 text-sm text-[#EDE8DF]/80">
              <li><Link href="#" className="hover:text-[#B8960C] transition-colors inline-block hover:translate-x-1 transform duration-300">Sakramen Baptis</Link></li>
              <li><Link href="#" className="hover:text-[#B8960C] transition-colors inline-block hover:translate-x-1 transform duration-300">Komuni Pertama</Link></li>
              <li><Link href="#" className="hover:text-[#B8960C] transition-colors inline-block hover:translate-x-1 transform duration-300">Sakramen Krisma</Link></li>
              <li><Link href="/masuk" className="hover:text-[#B8960C] transition-colors inline-block hover:translate-x-1 transform duration-300 flex items-center gap-2">Login Pendaftar Nikah</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <h4 className="text-white font-bold uppercase tracking-[0.15em] text-xs mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>Sekretariat</h4>
            <ul className="space-y-5 text-sm text-[#EDE8DF]/80">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-[#B8960C] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-light">Jl. Gereja No.12, Martapura, Kalimantan Selatan</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} className="text-[#B8960C] flex-shrink-0" />
                <span className="font-light tracking-wide">(0511) 1234567</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="text-[#B8960C] flex-shrink-0" />
                <span className="font-light tracking-wide">sekretariat@katedral.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#FAF7F2]/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#EDE8DF]/60 text-xs font-light tracking-wide">
            © {new Date().getFullYear()} Paroki Katedral Santo Yosef Martapura. Semua hak dilindungi.
          </p>
          <div className="flex gap-8 text-[#EDE8DF]/60 text-xs font-light tracking-wide">
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
