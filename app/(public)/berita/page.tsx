import { db } from "@/lib/db";
import { contents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { CalendarDays, Church } from "lucide-react";
import BeritaListClient from "./BeritaListClient";

export default async function BeritaPage() {
  const allNews = await db.select()
    .from(contents)
    .where(eq(contents.type, "NEWS"))
    .orderBy(desc(contents.createdAt));

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      
      {/* Header */}
      <div className="bg-[#F5F0E8] border-b border-[#DDD8D0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-[#A89880] uppercase tracking-wider mb-2 block">Beranda / Berita</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Berita & Pengumuman
          </h1>
          <p className="text-[#6B6560] max-w-2xl mx-auto">
            Informasi terbaru seputar kegiatan, agenda paroki, dan pengumuman sakramen.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BeritaListClient allNews={allNews} />
      </div>
    </div>
  );
}
