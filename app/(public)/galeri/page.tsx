import type { Metadata } from "next";
import { Images } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "Galeri Foto",
  description:
    "Galeri foto kegiatan dan dokumentasi Paroki Katedral Santo Yosef Pontianak — misa, perayaan, dan momen istimewa.",
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://kp-web-katedral-pontianak.vercel.app";

interface GalleryPhoto {
  id: string;
  title: string | null;
  body: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
}

async function getPhotos(): Promise<GalleryPhoto[]> {
  try {
    const res = await fetch(`${APP_URL}/api/public/galeri`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.photos || [];
  } catch {
    return [];
  }
}

// Masonry layout: split into 3 columns
function splitIntoColumns<T>(items: T[], cols: number): T[][] {
  const columns: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));
  return columns;
}

export default async function GaleriPage() {
  const photos = await getPhotos();
  const columns = splitIntoColumns(photos, 3);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="py-16" style={{ background: "#F5F0E8", borderBottom: "1px solid #E8E0D0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="none">
            <p className="section-label mb-3">Paroki Katedral Santo Yosef</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-4"
                style={{ fontFamily: "var(--font-cormorant)", color: "#2C1F14" }}>
              Galeri Foto
            </h1>
            <p className="text-[16px] max-w-xl mx-auto" style={{ color: "#6B5744" }}>
              Momen-momen berharga dari kegiatan dan perayaan di Paroki Katedral Santo Yosef Pontianak.
            </p>
            {photos.length > 0 && (
              <p className="text-sm mt-3" style={{ color: "#A89880" }}>{photos.length} foto tersedia</p>
            )}
          </ScrollReveal>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {photos.length === 0 ? (
          /* Empty State */
          <ScrollReveal direction="none">
            <div className="text-center py-24">
              <div className="inline-flex w-20 h-20 bg-[#FFF8E1] border border-[#B8960C]/20 rounded-full items-center justify-center mb-6">
                <Images size={36} className="text-[#B8960C]" />
              </div>
              <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                Belum Ada Foto
              </h2>
              <p className="text-[#6B6560] text-sm max-w-sm mx-auto">
                Galeri foto akan segera diisi oleh tim sekretariat paroki. Kunjungi kembali nanti.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={100}>
            <>
              {/* Masonry Grid — desktop 3 cols, tablet 2 cols, mobile 1 col */}
              <div className="hidden md:flex gap-4 items-start">
                {columns.map((col, colIdx) => (
                  <div key={colIdx} className="flex-1 space-y-4">
                    {col.map((photo) => (
                      <GalleryCard key={photo.id} photo={photo} />
                    ))}
                  </div>
                ))}
              </div>

              {/* Mobile: single column */}
              <div className="flex flex-col gap-4 md:hidden">
                {photos.map((photo) => (
                  <GalleryCard key={photo.id} photo={photo} />
                ))}
              </div>
            </>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

function GalleryCard({ photo }: { photo: GalleryPhoto }) {
  const dateStr = photo.createdAt
    ? new Date(photo.createdAt).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const filename = (photo.title || "foto-katedral")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-[#EDE8DF] shadow-sm hover:shadow-md transition-all duration-300">
      {photo.imageUrl ? (
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.imageUrl}
            alt={photo.title || "Foto Galeri Katedral"}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Hover overlay with description */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            {photo.body && (
              <p className="text-white text-sm font-medium line-clamp-2">{photo.body}</p>
            )}
          </div>

          {/* Download button — top right on hover */}
          <a
            href={`/api/public/galeri/download?url=${encodeURIComponent(photo.imageUrl)}&filename=${encodeURIComponent(filename)}`}
            download={`${filename}.jpg`}
            title="Unduh foto"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#3D2B1F] text-xs font-bold shadow-md border border-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#B8960C] hover:text-white hover:border-[#B8960C] hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Unduh
          </a>
        </div>
      ) : (
        <div className="w-full h-48 bg-[#F5F0E8] flex items-center justify-center">
          <Images size={32} className="text-[#DDD8D0]" />
        </div>
      )}

      {/* Caption area — show if title exists */}
      {(photo.title || dateStr) && (
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {photo.title && (
              <p className="text-sm font-semibold text-[#3D2B1F] line-clamp-1">{photo.title}</p>
            )}
            {dateStr && (
              <p className="text-xs text-[#A89880] mt-0.5">{dateStr}</p>
            )}
          </div>
          {/* Download button in caption bar (always visible, smaller) */}
          {photo.imageUrl && (
            <a
              href={`/api/public/galeri/download?url=${encodeURIComponent(photo.imageUrl)}&filename=${encodeURIComponent(filename)}`}
              download={`${filename}.jpg`}
              title="Unduh foto"
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#EDE8DF] text-[#B8960C] text-xs font-bold hover:bg-[#B8960C] hover:text-white hover:border-[#B8960C] transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Unduh
            </a>
          )}
        </div>
      )}
    </div>
  );
}
