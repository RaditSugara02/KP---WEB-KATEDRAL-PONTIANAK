"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

type Wedding = {
  groomName: string | null;
  brideName: string | null;
  weddingDate: string | null;
};

interface WeddingAnnouncementsClientProps {
  weddings: Wedding[];
}

export function WeddingAnnouncementsClient({ weddings }: WeddingAnnouncementsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const displayWeddings = useMemo(() => {
    // 1. Sort all weddings by date (oldest to newest for upcoming, newest to oldest for past)
    // Actually, let's just sort ascending by date generally.
    const sortedWeddings = [...weddings].sort((a, b) => {
      const dateA = a.weddingDate ? new Date(a.weddingDate).getTime() : 0;
      const dateB = b.weddingDate ? new Date(b.weddingDate).getTime() : 0;
      return dateA - dateB; // Ascending (earliest first)
    });

    const now = new Date();
    // Reset time to start of day for comparison
    now.setHours(0, 0, 0, 0);

    if (searchQuery.trim() === "") {
      // DEFAULT VIEW: Show top 3 upcoming weddings
      const upcoming = sortedWeddings.filter((w) => {
        if (!w.weddingDate) return false;
        const d = new Date(w.weddingDate);
        return d.getTime() >= now.getTime();
      });
      return upcoming.slice(0, 3);
    } else {
      // SEARCH VIEW: Show all weddings (past and future) that match the search query
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = sortedWeddings.filter((w) => {
        const groomMatch = w.groomName?.toLowerCase().includes(lowerQuery);
        const brideMatch = w.brideName?.toLowerCase().includes(lowerQuery);
        return groomMatch || brideMatch;
      });
      
      // When searching, it might be better to show closest dates first, or maybe descending.
      // Let's sort descending (newest first) for search results so they see the most recent ones if they search a common name.
      return filtered.sort((a, b) => {
        const dateA = a.weddingDate ? new Date(a.weddingDate).getTime() : 0;
        const dateB = b.weddingDate ? new Date(b.weddingDate).getTime() : 0;
        return dateB - dateA; // Descending
      });
    }
  }, [weddings, searchQuery]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="relative mb-2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9C8B7A] h-5 w-5" />
        <input
          type="text"
          placeholder="Cari nama mempelai (termasuk yang sudah lewat)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-[#EDE8DF] bg-[#FAF7F2]/50 focus:bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none transition-all shadow-sm font-sans placeholder:font-light text-[#3D2B1F]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ul className="flex flex-col space-y-6 min-h-[300px]">
        {displayWeddings.length > 0 ? (
          displayWeddings.map((item, i) => {
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

            return (
              <li
                key={i}
                className="pb-6 border-b border-[#EDE8DF] flex flex-col md:flex-row md:items-center justify-between gap-2 group"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className="w-8 h-8 shrink-0 rounded-full bg-[#F5F0E8] text-[#B8960C] flex items-center justify-center font-bold text-sm"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[#6B6560] text-sm uppercase tracking-wider font-bold shrink-0">
                    {dateStr}
                  </span>
                </div>
                <span
                  className="font-bold text-[#3D2B1F] text-xl md:text-right group-hover:text-[#B8960C] transition-colors"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {item.groomName || "N/A"} & {item.brideName || "N/A"}
                </span>
              </li>
            );
          })
        ) : (
          <li className="pb-6 border-b border-[#EDE8DF] flex flex-col justify-center gap-2 group">
            <span
              className="font-bold text-[#3D2B1F] text-lg text-center opacity-60 italic"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {searchQuery.trim() !== ""
                ? "Tidak ada pengumuman perkawinan yang cocok dengan pencarian Anda."
                : "Belum ada pengumuman perkawinan dalam waktu dekat."}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
