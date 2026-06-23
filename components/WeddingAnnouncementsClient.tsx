"use client";

import { useState, useMemo } from "react";
import { Search, CalendarDays } from "lucide-react";
import Image from "next/image";

type Wedding = {
  groomName: string | null;
  brideName: string | null;
  weddingDate: string | null;
  couplePhoto: string | null;
};

interface WeddingAnnouncementsClientProps {
  weddings: Wedding[];
}

export function WeddingAnnouncementsClient({ weddings }: WeddingAnnouncementsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const displayWeddings = useMemo(() => {
    // Sort all weddings ascending by date
    const sortedWeddings = [...weddings].sort((a, b) => {
      const dateA = a.weddingDate ? new Date(a.weddingDate).getTime() : 0;
      const dateB = b.weddingDate ? new Date(b.weddingDate).getTime() : 0;
      return dateA - dateB; 
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (searchQuery.trim() === "") {
      // DEFAULT VIEW: Show upcoming weddings (max 6 for a nice grid)
      const upcoming = sortedWeddings.filter((w) => {
        if (!w.weddingDate) return false;
        const d = new Date(w.weddingDate);
        return d.getTime() >= now.getTime();
      });
      return upcoming.slice(0, 6);
    } else {
      // SEARCH VIEW: Show all weddings that match the search query (sort descending)
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = sortedWeddings.filter((w) => {
        const groomMatch = w.groomName?.toLowerCase().includes(lowerQuery);
        const brideMatch = w.brideName?.toLowerCase().includes(lowerQuery);
        return groomMatch || brideMatch;
      });
      
      return filtered.sort((a, b) => {
        const dateA = a.weddingDate ? new Date(a.weddingDate).getTime() : 0;
        const dateB = b.weddingDate ? new Date(b.weddingDate).getTime() : 0;
        return dateB - dateA; // Descending
      });
    }
  }, [weddings, searchQuery]);

  return (
    <div className="flex flex-col w-full">
      {/* Search Bar - Modern Pill Style */}
      <div className="max-w-2xl mx-auto w-full mb-12">
        <div className="relative group bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EDE8DF] transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(184,150,12,0.15)] focus-within:border-[#B8960C]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9C8B7A] h-5 w-5 group-focus-within:text-[#B8960C] transition-colors" />
          <input
            type="text"
            placeholder="Cari nama mempelai (termasuk yang sudah lewat)..."
            className="w-full pl-14 pr-6 py-4 bg-transparent border-none outline-none text-[#3D2B1F] placeholder:text-[#9C8B7A] placeholder:font-light font-sans text-base rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Cards */}
      {displayWeddings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {displayWeddings.map((item, i) => {
            let dateStr = "Pengumuman";
            if (item.weddingDate) {
              const d = new Date(item.weddingDate);
              if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
              }
            }

            // Get initials for fallback
            const groomInit = item.groomName ? item.groomName.charAt(0).toUpperCase() : "G";
            const brideInit = item.brideName ? item.brideName.charAt(0).toUpperCase() : "B";

            return (
              <div 
                key={i} 
                className="group bg-white rounded-2xl overflow-hidden border border-[#EDE8DF] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
              >
                {/* Photo or Monogram Area */}
                <div className="relative h-60 w-full bg-[#F5F0E8] overflow-hidden">
                  {item.couplePhoto ? (
                    <Image
                      src={item.couplePhoto}
                      alt={`Foto ${item.groomName} & ${item.brideName}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    // Elegant Monogram Fallback
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FAF7F2] to-[#EDE8DF]">
                      <div className="w-24 h-24 rounded-full border border-[#B8960C]/30 flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-inner relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-[#B8960C]/5" />
                        <span className="text-3xl text-[#B8960C] font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                          {groomInit}<span className="text-[#9C8B7A] mx-1">&</span>{brideInit}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Date Badge over image */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-md flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-[#B8960C]" />
                    <span className="text-xs font-bold text-[#3D2B1F] tracking-wide">{dateStr}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-6 md:p-8 flex-grow flex flex-col justify-center items-center text-center bg-white">
                  <span className="font-sans text-[10px] tracking-[0.3em] text-[#B8960C] uppercase font-bold mb-3">
                    Calon Mempelai
                  </span>
                  <h3 className="text-2xl md:text-3xl text-[#3D2B1F] font-bold leading-tight group-hover:text-[#B8960C] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {item.groomName?.split(' ')[0] || "N/A"}<br/>
                    <span className="text-[#9C8B7A] text-xl">&amp;</span><br/>
                    {item.brideName?.split(' ')[0] || "N/A"}
                  </h3>
                  <p className="text-xs text-[#9C8B7A] mt-4 line-clamp-1 opacity-70">
                    {item.groomName} &amp; {item.brideName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#EDE8DF] shadow-sm">
          <div className="w-20 h-20 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-6 border border-[#E8E0D0]">
            <Search className="text-[#B8960C] h-8 w-8 opacity-50" />
          </div>
          <h3 className="text-2xl font-bold text-[#3D2B1F] mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
            Tidak Ditemukan
          </h3>
          <p className="text-[#6B5744] text-base max-w-md font-light">
            {searchQuery.trim() !== ""
              ? "Kami tidak dapat menemukan nama pasangan yang cocok dengan pencarian Anda."
              : "Belum ada pengumuman perkawinan dalam waktu dekat."}
          </p>
        </div>
      )}
    </div>
  );
}
