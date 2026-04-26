"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Church, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Berita", href: "/berita" },
    { name: "Jadwal Misa", href: "/jadwal-misa" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FAF7F2] border-b border-[#DDD8D0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#B8960C] text-white flex items-center justify-center group-hover:bg-[#9A7A00] transition-colors shadow-sm">
              <Church size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-[#3D2B1F] leading-none" style={{ fontFamily: "var(--font-cormorant)" }}>
                Katedral Santo Yosef
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#B8960C] font-bold mt-1">Martapura</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-semibold tracking-wide hover:text-[#B8960C] transition-colors ${
                  pathname === link.href ? "text-[#B8960C]" : "text-[#3D2B1F]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/masuk"
              className="text-sm font-bold text-[#B8960C] hover:text-[#9A7A00] transition-colors"
            >
              Masuk
            </Link>
            <Link 
              href="/daftar"
              className="px-5 py-2.5 bg-[#B8960C] text-white text-sm font-bold rounded hover:bg-[#9A7A00] transition-colors shadow-sm"
            >
              Daftar Pernikahan
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#3D2B1F] hover:text-[#B8960C] p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#DDD8D0]">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-semibold ${
                  pathname === link.href ? "bg-[#FFF8E1] text-[#B8960C]" : "text-[#3D2B1F] hover:bg-[#EDE8DF]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-[#DDD8D0] flex flex-col gap-3">
              <Link 
                href="/masuk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-[#B8960C] font-bold border border-[#B8960C] rounded-md"
              >
                Masuk ke Akun
              </Link>
              <Link 
                href="/daftar"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-[#B8960C] text-white font-bold rounded-md shadow-sm"
              >
                Daftar Pernikahan
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
