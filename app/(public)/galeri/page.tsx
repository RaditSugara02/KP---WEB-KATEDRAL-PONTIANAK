import type { Metadata } from "next";
import { Images } from "lucide-react";

export const metadata: Metadata = {
  title: "Galeri Foto",
  description:
    "Galeri foto kegiatan dan dokumentasi Paroki Katedral Santo Yosef Martapura — misa, perayaan, dan momen istimewa.",
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
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#3D2B1F] via-[#5C3D2A] to-[#2D1F13] text-white py-24 px-4 text-center">
        <p className="text-[#F5D78A] text-xs font-bold uppercase tracking-[4px] mb-4">Dokumentasi</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          Galeri Foto
        </h1>
        <p className="text-white/70 max-w-xl mx-auto text-base">
          Momen-momen berharga dari kegiatan dan perayaan di Paroki Katedral Santo Yosef Martapura.
        </p>
        {photos.length > 0 && (
          <p className="text-white/50 text-sm mt-3">{photos.length} foto tersedia</p>
        )}
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {photos.length === 0 ? (
          /* Empty State */
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
        ) : (
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
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            {photo.body && (
              <p className="text-white text-sm font-medium line-clamp-2">{photo.body}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-48 bg-[#F5F0E8] flex items-center justify-center">
          <Images size={32} className="text-[#DDD8D0]" />
        </div>
      )}

      {/* Caption area — show if title exists */}
      {(photo.title || dateStr) && (
        <div className="px-4 py-3">
          {photo.title && (
            <p className="text-sm font-semibold text-[#3D2B1F] line-clamp-1">{photo.title}</p>
          )}
          {dateStr && (
            <p className="text-xs text-[#A89880] mt-0.5">{dateStr}</p>
          )}
        </div>
      )}
    </div>
  );
}
