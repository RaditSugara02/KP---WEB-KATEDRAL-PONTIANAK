"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
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
  location: string | null;
  imageUrl: string | null;
  category: string | null;
};

export default function EditKontenClient({ content }: { content: ContentItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: content.id,
    title: content.title || "",
    type: content.type || "NEWS",
    body: content.body || "",
    eventDate: content.eventDate || "",
    location: content.location || "",
    imageUrl: content.imageUrl || "",
    category: content.category || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/konten", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

      {/* Kategori Berita (Khusus Berita) */}
      {form.type === "NEWS" && (
        <div>
          <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
            Kategori Berita <span className="text-[#A89880] font-normal">(Opsional)</span>
          </label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="cth: Pengumuman, Kegiatan, Renungan"
            className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
          />
          <p className="mt-1.5 text-xs text-[#A89880]">Kategori ini akan muncul sebagai filter di halaman berita publik.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-[#F5F0E8] rounded-lg border border-[#EDE8DF]">
          <div>
            <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Waktu (Jam)</label>
            <input type="text" name="eventDate" value={form.eventDate} onChange={handleChange}
              placeholder="cth: 07.00" className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Lokasi</label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              placeholder="cth: Gereja Utama" className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
          </div>
        </div>
      )}

      {/* Isi Konten — hidden for gallery (uses caption instead) */}
      {!isGallery && (
        <div>
          <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">
            {isMassSchedule ? "Keterangan Tambahan" : "Isi Konten / Artikel"}
          </label>
          <textarea name="body" value={form.body} onChange={handleChange} rows={8}
            className="w-full px-4 py-3 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none resize-y" />
        </div>
      )}

      {/* Gambar — ImageUpload untuk semua tipe kecuali MASS_SCHEDULE */}
      {isGallery ? (
        <div className="p-5 bg-[#F5F0E8] rounded-lg border border-[#EDE8DF] space-y-4">
          <ImageUpload
            label="Foto Galeri"
            required
            value={form.imageUrl}
            onChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
          />
          <div>
            <label className="block text-xs text-[#6B6560] mb-1">Keterangan Foto (Opsional)</label>
            <input type="text" name="body" value={form.body} onChange={handleChange}
              placeholder="cth: Perayaan Misa Natal 2024"
              className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-white focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" />
          </div>
        </div>
      ) : !isMassSchedule && (
        <ImageUpload
          label="Gambar Cover (Opsional)"
          value={form.imageUrl}
          onChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-[#EDE8DF]">
        <Link href="/admin/konten"
          className="px-6 py-2.5 bg-white border border-[#DDD8D0] rounded-md text-sm font-bold text-[#6B6560] hover:bg-[#FAF7F2] transition-colors">
          Batal
        </Link>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#B8960C] text-white font-bold text-sm rounded-md hover:bg-[#9A7A00] transition-colors shadow-sm disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}
