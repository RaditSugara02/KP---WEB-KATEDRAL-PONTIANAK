import { db } from "@/lib/db";
import { contents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CalendarDays, Church, ArrowLeft, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BeritaDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const newsRecord = await db.select()
    .from(contents)
    .where(eq(contents.slug, slug))
    .limit(1);

  if (newsRecord.length === 0) {
    notFound();
  }

  const news = newsRecord[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      
      {/* Header Image */}
      <div className="w-full h-72 md:h-96 bg-[#2C1F14] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1F14] to-transparent z-10" />
        {news.imageUrl ? (
          <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <Church size={120} className="text-[#EDE8DF]" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 pb-20">
        
        {/* Article Card */}
        <div className="bg-white rounded-xl shadow-md border border-[#DDD8D0] p-6 md:p-12">
          
          <Link href="/berita" className="inline-flex items-center gap-2 text-sm text-[#B8960C] font-bold hover:underline mb-8">
            <ArrowLeft size={16} /> Kembali ke Berita
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#FFF8E1] text-[#B8960C] text-[10px] font-bold uppercase rounded-full tracking-widest">
              Pengumuman
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#A89880] font-medium border-l border-[#DDD8D0] pl-3">
              <CalendarDays size={14} />
              <span>{new Date(news.createdAt || new Date()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[#3D2B1F] mb-8 leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
            {news.title}
          </h1>

          <div className="prose prose-stone max-w-none text-[#6B6560] prose-p:leading-relaxed prose-p:mb-6 prose-a:text-[#B8960C] prose-headings:font-bold prose-headings:text-[#3D2B1F]">
            {/* Split body by newlines to render simple paragraphs since we don't have a rich text HTML yet */}
            {news.body?.split('\n').map((paragraph, idx) => (
              paragraph.trim() && <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Share & Footer */}
          <div className="mt-12 pt-8 border-t border-[#EDE8DF] flex justify-between items-center">
            <div className="text-sm font-medium text-[#A89880]">
              Dipublikasikan oleh: <strong className="text-[#3D2B1F]">Sekretariat Paroki</strong>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#DDD8D0] rounded-md text-sm font-bold text-[#6B6560] hover:bg-[#F5F0E8] hover:text-[#3D2B1F] transition-colors">
              <Share2 size={16} /> Bagikan
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
