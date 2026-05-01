"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CalendarDays, Church, ArrowLeft, ArrowRight } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  slug: string | null;
  body: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
  category: string | null;
};

export default function BeritaListClient({ allNews }: { allNews: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("Semua Berita");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique categories, ignoring null/empty
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allNews.forEach(news => {
      if (news.category && news.category.trim() !== "") {
        cats.add(news.category.trim());
      }
    });
    return ["Semua Berita", ...Array.from(cats)];
  }, [allNews]);

  // Filter and paginate news
  const { filteredNews, totalPages } = useMemo(() => {
    const filtered = allNews.filter(news => {
      if (activeCategory === "Semua Berita") return true;
      return news.category?.trim() === activeCategory;
    });

    return {
      filteredNews: filtered,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  }, [allNews, activeCategory]);

  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNews, currentPage]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll to top of list
    }
  };

  return (
    <>
      {/* Filter Categories */}
      <div className="flex flex-wrap gap-3 mb-12 border-b border-[#DDD8D0] pb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
              activeCategory === category
                ? "bg-[#3D2B1F] text-white"
                : "bg-white border border-[#DDD8D0] text-[#6B6560] hover:bg-[#F5F0E8]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid Berita */}
      {paginatedNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedNews.map((news) => (
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
                  {news.category && (
                    <span className="inline-block w-max px-2.5 py-1 bg-[#FFF8E1] text-[#B8960C] text-[10px] font-bold uppercase rounded-full tracking-wider mb-3">
                      {news.category}
                    </span>
                  )}
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
      ) : (
        <div className="text-center py-20 bg-white border border-[#DDD8D0] rounded-xl">
          <Church size={48} className="mx-auto text-[#DDD8D0] mb-4" />
          <h3 className="text-lg font-bold text-[#3D2B1F] mb-1">Tidak Ada Berita</h3>
          <p className="text-[#6B6560]">Belum ada berita untuk kategori ini.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-md bg-white border border-[#DDD8D0] text-[#6B6560] flex items-center justify-center hover:bg-[#F5F0E8] hover:border-[#B8960C] disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-[#DDD8D0] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            // Simplified pagination display for a reasonable number of pages
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 rounded-md font-bold flex items-center justify-center transition-colors ${
                    currentPage === pageNumber
                      ? "bg-[#3D2B1F] text-white"
                      : "bg-white border border-[#DDD8D0] text-[#6B6560] hover:bg-[#F5F0E8] hover:border-[#B8960C]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return <span key={pageNumber} className="text-[#A89880]">...</span>;
            }
            return null;
          })}

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-md bg-white border border-[#DDD8D0] text-[#6B6560] flex items-center justify-center hover:bg-[#F5F0E8] hover:border-[#B8960C] disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-[#DDD8D0] transition-colors"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </>
  );
}
