"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Church, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if we are on the landing page where the transparent navbar makes sense
  const isLandingPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Berita", href: "/berita" },
    { name: "Jadwal Misa", href: "/jadwal-misa" },
    { name: "Sakramen Perkawinan", href: "/sakramen-perkawinan" },
    { name: "Kontak", href: "/kontak" },
  ];

  // Determine navbar styles based on scroll and page
  const isTransparent = isLandingPage && !scrolled && !mobileMenuOpen;
  
  return (
    <nav 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        isTransparent 
          ? "bg-transparent py-4 border-b border-transparent" 
          : "bg-[#FAF7F2] py-0 border-b border-[#DDD8D0] shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 transition-all duration-500">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm",
              isTransparent ? "bg-white/20 backdrop-blur-sm text-white group-hover:bg-white/30" : "bg-[#B8960C] text-white group-hover:bg-[#9A7A00]"
            )}>
              <Church size={20} />
            </div>
            <div className="flex flex-col">
              <span 
                className={cn(
                  "font-bold text-xl leading-none transition-colors duration-500",
                  isTransparent ? "text-white" : "text-[#3D2B1F]"
                )} 
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Katedral Santo Yosef
              </span>
              <span 
                className={cn(
                  "text-[10px] uppercase tracking-widest font-bold mt-1 transition-colors duration-500",
                  isTransparent ? "text-white/80" : "text-[#B8960C]"
                )}
              >
                Martapura
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors relative group",
                    isTransparent 
                      ? "text-white/90 hover:text-white" 
                      : isActive ? "text-[#B8960C]" : "text-[#3D2B1F] hover:text-[#B8960C]"
                  )}
                >
                  {link.name}
                  {/* Elegant underline effect on hover */}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                    isTransparent ? "bg-white" : "bg-[#B8960C]",
                    isActive && !isTransparent && "w-full"
                  )}></span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 transition-colors",
                isTransparent ? "text-white hover:text-white/80" : "text-[#3D2B1F] hover:text-[#B8960C]"
              )}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#FAF7F2] border-t border-[#DDD8D0]",
        mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 border-transparent"
      )}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-md text-base font-medium transition-colors",
                  isActive ? "bg-[#FFF8E1] text-[#B8960C]" : "text-[#3D2B1F] hover:bg-[#EDE8DF]"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
