import Link from "next/link";
import { Church, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2C1F14] text-[#FAF7F2] pt-16 pb-8 border-t-4 border-[#B8960C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#B8960C] text-white flex items-center justify-center">
                <Church size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white leading-none" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Katedral
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#B8960C] font-bold mt-1">Santo Yosef</span>
              </div>
            </Link>
            <p className="text-[#A89880] text-sm leading-relaxed mb-6">
              Menjadi komunitas umat beriman yang paguyuban, memasyarakat, dan berpusat pada Kristus.
            </p>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Navigasi Cepat</h4>
            <ul className="space-y-3 text-sm text-[#A89880]">
              <li><Link href="/" className="hover:text-[#B8960C] transition-colors">Beranda</Link></li>
              <li><Link href="/jadwal-misa" className="hover:text-[#B8960C] transition-colors">Jadwal Misa</Link></li>
              <li><Link href="/berita" className="hover:text-[#B8960C] transition-colors">Berita & Pengumuman</Link></li>
              <li><Link href="/daftar" className="hover:text-[#B8960C] transition-colors">Pendaftaran Pernikahan</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Layanan Paroki</h4>
            <ul className="space-y-3 text-sm text-[#A89880]">
              <li><Link href="#" className="hover:text-[#B8960C] transition-colors">Sakramen Baptis</Link></li>
              <li><Link href="#" className="hover:text-[#B8960C] transition-colors">Komuni Pertama</Link></li>
              <li><Link href="#" className="hover:text-[#B8960C] transition-colors">Sakramen Krisma</Link></li>
              <li><Link href="/masuk" className="hover:text-[#B8960C] transition-colors">Login Pendaftar Nikah</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Kontak Sekretariat</h4>
            <ul className="space-y-4 text-sm text-[#A89880]">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#B8960C] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Jl. Gereja No.12, Martapura, Kalimantan Selatan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#B8960C] flex-shrink-0" />
                <span>(0511) 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#B8960C] flex-shrink-0" />
                <span>sekretariat@katedral.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#3D2B1F] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#A89880] text-xs">
            © {new Date().getFullYear()} Paroki Katedral Santo Yosef Martapura. Semua hak dilindungi.
          </p>
          <div className="flex gap-6 text-[#A89880] text-xs">
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
