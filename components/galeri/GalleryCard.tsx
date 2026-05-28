"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from "lucide-react";

interface LightboxProps {
  images: string[];
  initialIndex: number;
  title?: string;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, title, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const filename = (title || "foto-katedral")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold">
          {current + 1} / {images.length}
        </div>
      )}

      {/* Download */}
      <a
        href={`/api/public/galeri/download?url=${encodeURIComponent(images[current])}&filename=${encodeURIComponent(filename)}`}
        download
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 right-16 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-[#B8960C] flex items-center justify-center text-white transition-colors"
        title="Unduh foto"
      >
        <Download size={18} />
      </a>

      {/* Prev Arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full px-20 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={images[current]}
          src={images[current]}
          alt={title || "Foto galeri"}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          style={{ animation: "fadeIn 0.2s ease" }}
        />
      </div>

      {/* Next Arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Caption */}
      {title && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-6 py-2 rounded-full bg-black/60 text-white text-sm font-medium max-w-md text-center">
          {title}
        </div>
      )}

      {/* Thumbnails (if multiple) */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                i === current ? "border-[#B8960C] scale-110" : "border-white/20 opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}

// ── Gallery Card with carousel + lightbox ──────────────────────────────────

interface GalleryPhoto {
  id: string;
  title: string | null;
  body: string | null;
  imageUrl: string | null;
  images?: string[]; // multiple images
  createdAt: Date | string | null;
}

interface GalleryCardProps {
  photo: GalleryPhoto;
}

export function GalleryCard({ photo }: GalleryCardProps) {
  // Parse images: use "images" array from parsed body, fallback to single imageUrl
  const allImages: string[] = (() => {
    if (photo.images && photo.images.length > 0) return photo.images;
    if (photo.imageUrl) return [photo.imageUrl];
    return [];
  })();

  const [cardIndex, setCardIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const dateStr = photo.createdAt
    ? new Date(photo.createdAt).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const filename = (photo.title || "foto-katedral")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const cardPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardIndex((i) => (i - 1 + allImages.length) % allImages.length);
  };
  const cardNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardIndex((i) => (i + 1) % allImages.length);
  };

  const openLightbox = () => {
    setLightboxIndex(cardIndex);
    setLightboxOpen(true);
  };

  if (allImages.length === 0) return null;

  return (
    <>
      <div className="group relative bg-white rounded-xl overflow-hidden border border-[#EDE8DF] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">

        {/* Image area */}
        <div className="relative overflow-hidden" onClick={openLightbox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={allImages[cardIndex]}
            src={allImages[cardIndex]}
            alt={photo.title || "Foto Galeri Katedral"}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ animation: "fadeIn 0.15s ease" }}
            loading="lazy"
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="flex items-center gap-2 text-white text-xs font-semibold">
              <ZoomIn size={14} />
              Lihat foto
            </div>
          </div>

          {/* Image counter badge */}
          {allImages.length > 1 && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-bold">
              {cardIndex + 1}/{allImages.length}
            </div>
          )}

          {/* Carousel arrows (visible on hover if multiple) */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={cardPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={cardNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {allImages.length > 1 && allImages.length <= 8 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCardIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === cardIndex ? "bg-white scale-125" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Caption bar */}
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {photo.title && (
              <p className="text-sm font-semibold text-[#3D2B1F] line-clamp-1">{photo.title}</p>
            )}
            {dateStr && (
              <p className="text-xs text-[#A89880] mt-0.5">{dateStr}</p>
            )}
          </div>
          {/* Download current image */}
          <a
            href={`/api/public/galeri/download?url=${encodeURIComponent(allImages[cardIndex])}&filename=${encodeURIComponent(filename)}`}
            download={`${filename}.jpg`}
            onClick={(e) => e.stopPropagation()}
            title="Unduh foto"
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#EDE8DF] text-[#B8960C] text-xs font-bold hover:bg-[#B8960C] hover:text-white hover:border-[#B8960C] transition-all duration-200"
          >
            <Download size={11} />
            Unduh
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={allImages}
          initialIndex={lightboxIndex}
          title={photo.title || undefined}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </>
  );
}
