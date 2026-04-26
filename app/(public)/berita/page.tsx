import { db } from "@/lib/db";
import { contents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { CalendarDays, Church } from "lucide-react";

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
        
        {/* Filter Categories (Static UI) */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-[#DDD8D0] pb-6">
          <button className="px-5 py-2 bg-[#3D2B1F] text-white text-sm font-semibold rounded-full">Semua Berita</button>
          <button className="px-5 py-2 bg-white border border-[#DDD8D0] text-[#6B6560] hover:bg-[#F5F0E8] text-sm font-semibold rounded-full transition-colors">Pengumuman</button>
          <button className="px-5 py-2 bg-white border border-[#DDD8D0] text-[#6B6560] hover:bg-[#F5F0E8] text-sm font-semibold rounded-full transition-colors">Kegiatan</button>
          <button className="px-5 py-2 bg-white border border-[#DDD8D0] text-[#6B6560] hover:bg-[#F5F0E8] text-sm font-semibold rounded-full transition-colors">Renungan</button>
        </div>

        {/* Grid Berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allNews.map((news) => (
            <Link href={`/berita/${news.slug}`} key={news.id} className="group block h-full">
              <div className="bg-white rounded-xl overflow-hidden border border-[#DDD8D0] hover:border-[#B8960C] transition-all hover:shadow-md h-full flex flex-col">
                {/* Thumbnail */}
                <div className="h-56 bg-[#EDE8DF] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#3D2B1F] opacity-10 group-hover:opacity-0 transition-opacity" />
                  {news.imageUrl ? (
                    <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#A89880]">
                      <Church size={48} opacity={0.5} />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <span className="inline-block w-max px-2.5 py-1 bg-[#FFF8E1] text-[#B8960C] text-[10px] font-bold uppercase rounded-full tracking-wider mb-3">
                    Pengumuman
                  </span>
                  <h3 className="font-bold text-[#3D2B1F] text-xl mb-3 group-hover:text-[#B8960C] transition-colors leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-sm text-[#6B6560] line-clamp-3 mb-6 flex-1">
                    {news.body}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#EDE8DF] mt-auto">
                    <div className="flex items-center gap-2 text-xs text-[#A89880] font-medium">
                      <CalendarDays size={14} />
                      <span>{new Date(news.createdAt || new Date()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <span className="text-[#B8960C] text-xs font-bold group-hover:underline">Baca →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Dummy */}
        <div className="mt-16 flex justify-center gap-2">
          <button className="w-10 h-10 rounded-md bg-[#3D2B1F] text-white font-bold flex items-center justify-center">1</button>
          <button className="w-10 h-10 rounded-md bg-white border border-[#DDD8D0] text-[#6B6560] font-bold flex items-center justify-center hover:bg-[#F5F0E8] hover:border-[#B8960C]">2</button>
          <button className="w-10 h-10 rounded-md bg-white border border-[#DDD8D0] text-[#6B6560] font-bold flex items-center justify-center hover:bg-[#F5F0E8] hover:border-[#B8960C]">3</button>
        </div>

      </div>
    </div>
  );
}
