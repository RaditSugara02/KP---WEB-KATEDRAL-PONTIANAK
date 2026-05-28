"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Plus, Trash2, Images, ArrowUp, ArrowDown } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const CONTENT_TYPES = [
  { value: "NEWS", label: "Berita / Artikel" },
  { value: "MASS_SCHEDULE", label: "Jadwal Misa" },
  { value: "ANNOUNCEMENT", label: "Pengumuman" },
  { value: "GALLERY", label: "📷 Foto Galeri" },
];

type ContentItem = {
  id: string;
  title: string | null;
  type: string | null;
  body: string | null;
  eventDate: string | null;
  eventEndDate: string | null;
  location: string | null;
  imageUrl: string | null;
  category: string | null;
};

// Parse body to extract gallery images & caption
function parseGalleryBody(body: string | null, imageUrl: string | null): { images: string[]; caption: string } {
  try {
    const parsed = JSON.parse(body ?? "{}");
    const images: string[] = Array.isArray(parsed.images) ? parsed.images.filter(Boolean) : [];
    // ensure primary imageUrl is included
    if (imageUrl && !images.includes(imageUrl)) images.unshift(imageUrl);
    return { images, caption: parsed.caption || "" };
  } catch {
    // body is plain text
    return {
      images: imageUrl ? [imageUrl] : [],
      caption: body || "",
    };
  }
}

export default function EditKontenClient({ content }: { content: ContentItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initMassDay = content.type === "MASS_SCHEDULE" && content.category ? content.category.split("::")[0] : "Minggu";
  const initMassType = content.type === "MASS_SCHEDULE" && content.category ? content.category.split("::")[1] || "Harian" : "Harian";

  const [form, setForm] = useState({
    id: content.id,
    title: content.title || "",
    type: content.type || "NEWS",
    body: content.body || "",
    eventDate: content.eventDate || "",
    eventEndDate: content.eventEndDate || "",
    location: content.location || "",
    imageUrl: content.imageUrl || "",
    category: content.category || "",
    massDay: initMassDay,
    massType: initMassType,
  });

  // ── Gallery multi-image state ──────────────────────────────────────────────
  const initGallery = parseGalleryBody(content.body, content.imageUrl);
  const [galleryImages, setGalleryImages] = useState<string[]>(initGallery.images);
  const [galleryCaption, setGalleryCaption] = useState(initGallery.caption);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState("");

  const removePhoto = (idx: number) => setGalleryImages(prev => prev.filter((_, i) => i !== idx));
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setGalleryImages(prev => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  };
  const moveDown = (idx: number) => {
    setGalleryImages(prev => {
      if (idx >= prev.length - 1) return prev;
      const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a;
    });
  };
  const addPhoto = () => {
    if (tempPhotoUrl && galleryImages.length < 10) {
      setGalleryImages(prev => [...prev, tempPhotoUrl]);
      setTempPhotoUrl("");
      setShowAddPhoto(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: Record<string, string> = { ...form };
      if (payload.type === "MASS_SCHEDULE") {
        payload.category = `${payload.massDay}::${payload.massType}`;
      } else if (payload.type === "NEWS") {
        payload.category = "Berita Paroki";
      } else if (payload.type === "ANNOUNCEMENT") {
        payload.category = "Pengumuman";
      } else if (payload.type === "GALLERY") {
        payload.imageUrl = galleryImages[0] || "";
        payload.body = JSON.stringify({ images: galleryImages, caption: galleryCaption });
      }

      const res = await fetch("/api/admin/konten", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan perubahan.");

      router.push("/admin/konten");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const isMassSchedule = form.type === "MASS_SCHEDULE";
  const isGallery = form.type === "GALLERY";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm p-8 space-y-6">
      
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Tipe Konten */}
      <div>
        <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Tipe Konten</label>
        <div className="flex flex-wrap gap-3">
          {CONTENT_TYPES.map(ct => (
            <button key={ct.value} type="button"
              onClick={() => setForm(prev => ({ ...prev, type: ct.value }))}
              className={`px-5 py-2.5 rounded-md text-sm font-bold border-2 transition-colors ${
                form.type === ct.value
                  ? "bg-[#B8960C] border-[#B8960C] text-white"
                  : "bg-white border-[#DDD8D0] text-[#6B6560] hover:border-[#B8960C] hover:text-[#B8960C]"
              }`}
            >{ct.label}</button>
          ))}
        </div>
      </div>

      {/* Pengumuman Fields */}
      {form.type === "ANNOUNCEMENT" && (
        <div className="space-y-5 p-5 bg-[#F5F0E8] rounded-lg border border-[#EDE8DF]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
                Tanggal Acara <span className="text-[#A89880] font-normal">(Opsional)</span>
              </label>
              <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange}
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
                Tampilkan Sampai <span className="text-red-500">*</span>
              </label>
              <input type="date" name="eventEndDate" value={form.eventEndDate} onChange={handleChange} required
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
              Lokasi <span className="text-[#A89880] font-normal">(Opsional)</span>
            </label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              placeholder="cth: Gereja Katedral, Aula Paroki"
              className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
          </div>
        </div>
      )}

      {/* Judul */}
      <div>
        <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Judul <span className="text-red-500">*</span></label>
        <input type="text" name="title" value={form.title} onChange={handleChange} required
          className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
      </div>

      {/* Jadwal Misa Fields */}
      {isMassSchedule && (
        <div className="space-y-5 p-5 bg-[#F5F0E8] rounded-lg border border-[#EDE8DF]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Tanggal</label>
              <input type="date" name="massDay" value={form.massDay} onChange={handleChange}
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Jenis Misa</label>
              <select name="massType" value={form.massType} onChange={handleChange}
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none">
                <option value="Harian">Misa Harian / Umum</option>
                <option value="Khusus">Misa Khusus (Hari Raya / Acara Khusus)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Waktu (Jam)</label>
              <input type="time" name="eventDate" value={form.eventDate} onChange={handleChange}
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Lokasi</label>
              <input type="text" name="location" value={form.location} onChange={handleChange}
                placeholder="cth: Gereja Utama" className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Isi Konten — hidden for gallery */}
      {!isGallery && (
        <div>
          <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
            {isMassSchedule ? "Keterangan Tambahan" : "Isi Konten / Artikel"}
          </label>
          <textarea name="body" value={form.body} onChange={handleChange} rows={8}
            className="w-full px-4 py-3 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none resize-y" />
        </div>
      )}

      {/* ── GALLERY EDITOR ─────────────────────────────────────────────────── */}
      {isGallery ? (
        <div className="p-5 bg-[#F5F0E8] rounded-lg border border-[#EDE8DF] space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Images size={16} className="text-[#B8960C]" />
              <h3 className="text-xs font-bold text-[#6B6560] uppercase tracking-wider">
                Foto Album ({galleryImages.length}/10)
              </h3>
            </div>
            {galleryImages.length === 0 && (
              <span className="text-xs text-red-500 font-semibold">Minimal 1 foto diperlukan</span>
            )}
          </div>

          {/* Thumbnail grid with controls */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryImages.map((url, idx) => (
                <div key={`${url}-${idx}`} className="relative group rounded-xl overflow-hidden border-2 border-[#DDD8D0] bg-[#FAF7F2] aspect-[4/3] shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`foto ${idx + 1}`} className="w-full h-full object-cover" />

                  {/* Primary badge */}
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#B8960C] text-white text-[9px] font-bold rounded-full shadow">
                      ★ Utama
                    </span>
                  )}

                  {/* Action overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {/* Move up/down */}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        title="Pindah ke kiri"
                        className="w-7 h-7 rounded-md bg-white/90 text-[#3D2B1F] flex items-center justify-center hover:bg-[#B8960C] hover:text-white transition-colors disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === galleryImages.length - 1}
                        title="Pindah ke kanan"
                        className="w-7 h-7 rounded-md bg-white/90 text-[#3D2B1F] flex items-center justify-center hover:bg-[#B8960C] hover:text-white transition-colors disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      title="Hapus foto ini"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={10} /> Hapus
                    </button>
                  </div>

                  {/* Index number */}
                  <span className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white text-[9px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Hint text */}
          {galleryImages.length > 0 && (
            <p className="text-[11px] text-[#A89880]">
              💡 Hover foto → klik ↑↓ untuk ubah urutan · Foto pertama (★ Utama) jadi thumbnail album
            </p>
          )}

          {/* Add photo panel */}
          {galleryImages.length < 10 && (
            <div>
              {!showAddPhoto ? (
                <button
                  type="button"
                  onClick={() => setShowAddPhoto(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#B8960C]/40 rounded-xl text-[#B8960C] text-sm font-semibold hover:border-[#B8960C] hover:bg-[#FFF8E1] transition-colors w-full justify-center"
                >
                  <Plus size={16} /> Tambah Foto Baru
                </button>
              ) : (
                <div className="space-y-3 p-4 bg-white rounded-xl border-2 border-[#B8960C]/30">
                  <p className="text-xs font-bold text-[#3D2B1F]">Upload foto baru ke album:</p>
                  <ImageUpload
                    label="Pilih Foto"
                    value={tempPhotoUrl}
                    onChange={setTempPhotoUrl}
                    placeholder="https://example.com/foto.jpg"
                    aspectRatio={4/3}
                    helpText="Rasio 4:3 disarankan. Setelah upload berhasil, klik tombol Tambahkan."
                  />
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => { setShowAddPhoto(false); setTempPhotoUrl(""); }}
                      className="px-4 py-2 text-xs font-bold text-[#6B6560] bg-[#F5F0E8] rounded-lg hover:bg-[#EDE8DF] transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={!tempPhotoUrl}
                      onClick={addPhoto}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#B8960C] rounded-lg hover:bg-[#9A7A00] transition-colors disabled:opacity-40"
                    >
                      <Plus size={12} /> Tambahkan ke Album
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Caption */}
          <div className="pt-2 border-t border-[#DDD8D0]">
            <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
              Keterangan Album <span className="font-normal text-[#A89880]">(Opsional)</span>
            </label>
            <input
              type="text"
              value={galleryCaption}
              onChange={(e) => setGalleryCaption(e.target.value)}
              placeholder="cth: Perayaan Natal 2024 di Katedral Santo Yosef"
              className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
            />
          </div>
        </div>
      ) : !isMassSchedule && (
        <ImageUpload
          label="Gambar Cover (Opsional)"
          value={form.imageUrl}
          onChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
          aspectRatio={16/9}
          helpText="Disarankan resolusi 1280x720 px (Rasio 16:9) agar gambar sampul tidak terpotong saat ditampilkan."
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-[#EDE8DF]">
        <Link href="/admin/konten"
          className="px-6 py-2.5 bg-white border border-[#DDD8D0] rounded-md text-sm font-bold text-[#6B6560] hover:bg-[#FAF7F2] transition-colors">
          Batal
        </Link>
        <button type="submit" disabled={loading || (isGallery && galleryImages.length === 0)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#B8960C] text-white font-bold text-sm rounded-md hover:bg-[#9A7A00] transition-colors shadow-sm disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}
