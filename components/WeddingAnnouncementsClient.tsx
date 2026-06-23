"use client";

import { useState, useMemo } from "react";
import { Search, CalendarDays } from "lucide-react";

type Wedding = {
  groomName: string | null;
  brideName: string | null;
  weddingDate: string | null;
  couplePhoto: string | null; // We might not use it based on user request, but type is fine
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
      // DEFAULT VIEW: Show upcoming weddings
      const upcoming = sortedWeddings.filter((w) => {
        if (!w.weddingDate) return false;
        const d = new Date(w.weddingDate);
        return d.getTime() >= now.getTime();
      });
      return upcoming.slice(0, 3); // Just 3 for default view
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
    <div className="flex flex-col flex-grow w-full h-full">
      {/* Search Bar - Modern Pill Style */}
      <div className="relative group bg-white rounded-full shadow-sm border border-[#EDE8DF] transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(184,150,12,0.15)] focus-within:border-[#B8960C] mb-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9C8B7A] h-5 w-5 group-focus-within:text-[#B8960C] transition-colors" />
        <input
          type="text"
          placeholder="Cari nama mempelai (termasuk yang sudah lewat)..."
          className="w-full pl-12 pr-6 py-3 bg-transparent border-none outline-none text-[#3D2B1F] placeholder:text-[#9C8B7A] placeholder:font-light font-sans text-sm rounded-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Simple List view */}
      <div className="flex flex-col flex-grow">
        {displayWeddings.length > 0 ? (
          <ul className="space-y-6">
            {displayWeddings.map((item, i) => {
              let dateStr = "Belum ditentukan";
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

              return (
                <li key={i} className="border-b border-[#EDE8DF] pb-6 last:border-0 last:pb-0">
                  <h3 className="text-xl md:text-2xl text-[#3D2B1F] font-bold mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {item.groomName || "N/A"} &amp; {item.brideName || "N/A"}
                  </h3>
                  <div className="flex items-center text-sm text-[#6B6560]">
                    <CalendarDays className="h-4 w-4 mr-2 text-[#B8960C]" />
                    <span>{dateStr}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow py-20 text-center bg-white rounded-2xl border border-[#EDE8DF] shadow-sm mt-auto mb-0 min-h-[300px]">
            <div className="w-16 h-16 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-4 border border-[#E8E0D0]">
              <Search className="text-[#B8960C] h-6 w-6 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-[#3D2B1F] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
              Tidak Ditemukan
            </h3>
            <p className="text-[#6B5744] text-sm max-w-sm font-light">
              {searchQuery.trim() !== ""
                ? "Kami tidak dapat menemukan nama pasangan yang cocok dengan pencarian Anda."
                : "Belum ada pengumuman perkawinan dalam waktu dekat."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
