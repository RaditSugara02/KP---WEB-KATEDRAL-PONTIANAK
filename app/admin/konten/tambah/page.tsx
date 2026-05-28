"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Plus, Trash2, Images } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const CONTENT_TYPES = [
  { value: "NEWS", label: "Berita / Artikel" },
  { value: "MASS_SCHEDULE", label: "Jadwal Misa" },
  { value: "ANNOUNCEMENT", label: "Pengumuman" },
  { value: "GALLERY", label: "📷 Foto Galeri" },
];

export default function TambahKontenPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    type: "NEWS",
    category: "",
    massDay: "",
    massType: "Harian",
    body: "",
    eventDate: "07:00",
    eventEndDate: "",
    location: "",
    imageUrl: "",
  });

  // Gallery: multiple images
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState("");

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
        // Store multiple images in body as JSON; first image is primary imageUrl
        payload.imageUrl = galleryImages[0] || "";
        payload.body = JSON.stringify({
          images: galleryImages,
          caption: galleryCaption,
        });
      }

      const res = await fetch("/api/admin/konten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan konten.");
      
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
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/konten" className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DDD8D0] rounded-full text-xs font-semibold text-[#6B6560] hover:bg-[#FAF7F2] transition-colors">
          <ArrowLeft size={14} /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Tambah Konten Baru
        </h1>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm p-8 space-y-6">

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Tipe Konten */}
        <div>
          <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
            Tipe Konten <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {CONTENT_TYPES.map(ct => (
              <button
                key={ct.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, type: ct.value }))}
                className={`px-5 py-2.5 rounded-md text-sm font-bold border-2 transition-colors ${
                  form.type === ct.value
                    ? "bg-[#B8960C] border-[#B8960C] text-white"
                    : "bg-white border-[#DDD8D0] text-[#6B6560] hover:border-[#B8960C] hover:text-[#B8960C]"
                }`}
              >
                {ct.label}
              </button>
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
                <input
                  type="date"
                  name="eventDate"
                  value={form.type === "ANNOUNCEMENT" ? form.eventDate : ""}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
                />
                <p className="mt-1.5 text-xs text-[#A89880]">Tanggal acara akan ditampilkan di agenda.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
                  Tampilkan Sampai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="eventEndDate"
                  value={form.eventEndDate}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
                />
                <p className="mt-1.5 text-xs text-[#A89880]">Setelah tanggal ini, pengumuman tidak tampil di landing page tapi tetap ada di halaman berita.</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
                Lokasi <span className="text-[#A89880] font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="cth: Gereja Katedral, Aula Paroki"
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
              />
            </div>
          </div>
        )}

        {/* Judul */}
        <div>
          <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder={isMassSchedule ? "cth: Misa Minggu Pagi" : "cth: Jadwal Misa Pekan Suci 2025"}
            className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
          />
        </div>

        {/* Conditional: Jadwal Misa Fields */}
        {isMassSchedule && (
          <div className="space-y-5 p-5 bg-[#F5F0E8] rounded-lg border border-[#EDE8DF]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="massDay"
                  value={form.massDay}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
                  Jenis Misa <span className="text-red-500">*</span>
                </label>
                <select
                  name="massType"
                  value={form.massType}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
                >
                  <option value="Harian">Misa Harian / Umum</option>
                  <option value="Khusus">Misa Khusus (Hari Raya / Acara Khusus)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
                  Waktu (Jam) <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
                  Lokasi / Gedung
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="cth: Gereja Utama"
                  className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Isi Konten — hidden for gallery */}
        {!isGallery && (
          <div>
            <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
              {isMassSchedule ? "Keterangan Tambahan" : "Isi Konten / Artikel"}
              {!isMassSchedule && <span className="text-red-500"> *</span>}
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              rows={8}
              placeholder={isMassSchedule ? "Keterangan opsional mengenai jadwal misa..." : "Tulis isi berita atau pengumuman di sini..."}
              className="w-full px-4 py-3 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none resize-y"
            />
          </div>
        )}

        {/* URL Gambar (News) atau Upload Foto (Gallery) */}
        {isGallery ? (
          <div className="p-5 bg-[#F5F0E8] rounded-lg border border-[#EDE8DF] space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Images size={16} className="text-[#B8960C]" />
              <h3 className="text-xs font-bold text-[#6B6560] uppercase tracking-wider">
                Foto Album ({galleryImages.length}/10)
              </h3>
            </div>

            {/* Thumbnail grid of added photos */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3">
                {galleryImages.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-[#DDD8D0] bg-[#FAF7F2]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`foto ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#B8960C] text-white text-[9px] font-bold rounded">Utama</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add photo button / upload form */}
            {galleryImages.length < 10 && (
              <div>
                {!showAddPhoto ? (
                  <button
                    type="button"
                    onClick={() => setShowAddPhoto(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[#B8960C]/40 rounded-lg text-[#B8960C] text-sm font-semibold hover:border-[#B8960C] hover:bg-[#FFF8E1] transition-colors"
                  >
                    <Plus size={16} /> Tambah Foto
                  </button>
                ) : (
                  <div className="space-y-3 p-4 bg-white rounded-lg border border-[#DDD8D0]">
                    <ImageUpload
                      label="Upload Foto"
                      value={tempPhotoUrl}
                      onChange={setTempPhotoUrl}
                      placeholder="https://example.com/foto.jpg"
                      aspectRatio={4/3}
                      helpText="Rasio 4:3 disarankan. Setelah upload, klik Tambahkan."
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => { setShowAddPhoto(false); setTempPhotoUrl(""); }}
                        className="px-3 py-1.5 text-xs font-bold text-[#6B6560] bg-[#F5F0E8] rounded-md hover:bg-[#EDE8DF] transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        disabled={!tempPhotoUrl}
                        onClick={() => {
                          if (tempPhotoUrl) {
                            setGalleryImages(prev => [...prev, tempPhotoUrl]);
                            setTempPhotoUrl("");
                            setShowAddPhoto(false);
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#B8960C] rounded-md hover:bg-[#9A7A00] transition-colors disabled:opacity-40"
                      >
                        ✓ Tambahkan ke Album
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Caption */}
            <div>
              <label className="block text-xs text-[#6B6560] mb-1">Keterangan Album (Opsional)</label>
              <input
                type="text"
                value={galleryCaption}
                onChange={(e) => setGalleryCaption(e.target.value)}
                placeholder="cth: Perayaan Natal 2024"
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
              />
            </div>
          </div>
        ) : !isMassSchedule && (
          <ImageUpload
            label="Gambar Cover (Opsional)"
            value={form.imageUrl}
            onChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
            placeholder="https://example.com/gambar.jpg"
            aspectRatio={16/9}
            helpText="Disarankan resolusi 1280x720 px (Rasio 16:9) agar gambar sampul tidak terpotong saat ditampilkan."
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-[#EDE8DF]">
          <Link
            href="/admin/konten"
            className="px-6 py-2.5 bg-white border border-[#DDD8D0] rounded-md text-sm font-bold text-[#6B6560] hover:bg-[#FAF7F2] transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#B8960C] text-white font-bold text-sm rounded-md hover:bg-[#9A7A00] transition-colors shadow-sm disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Simpan & Publikasikan
          </button>
        </div>
      </form>
    </div>
  );
}
