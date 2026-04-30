import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description:
    "Informasi kontak, alamat, jam operasional sekretariat, dan jadwal misa Paroki Katedral Santo Yosef Martapura.",
};

const DEFAULT_INFO = {
  name: "Katedral Santo Yosef Martapura",
  address: "Jl. Gereja No. 1, Martapura, Kalimantan Selatan",
  phone: "0511-1234567",
  email: "sekretariat@katedral.id",
  operationalHours: "Senin–Jumat: 08.00–12.00 dan 13.00–16.00\nSabtu: 08.00–12.00\nMinggu & Hari Raya: Tutup",
  massTimes: "Jumat: 06.00 WIB\nSabtu: 17.00 WIB\nMinggu: 06.00 | 08.00 | 10.00 | 17.00 WIB",
};

async function getChurchInfo() {
  try {
    const APP_URL =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://kp-web-katedral-pontianak.vercel.app";
    const res = await fetch(`${APP_URL}/api/public/church-info`, {
      next: { revalidate: 3600 }, // cache 1 jam
    });
    if (!res.ok) return DEFAULT_INFO;
    const data = await res.json();
    return { ...DEFAULT_INFO, ...(data.settings || {}) };
  } catch {
    return DEFAULT_INFO;
  }
}

export default async function KontakPage() {
  const info = await getChurchInfo();

  const operationalLines = (info.operationalHours || "").split("\n").filter(Boolean);
  const massLines = (info.massTimes || "").split("\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#3D2B1F] via-[#5C3D2A] to-[#2D1F13] text-white py-24 px-4 text-center">
        <p className="text-[#F5D78A] text-xs font-bold uppercase tracking-[4px] mb-4">Hubungi Kami</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          Kontak &amp; Lokasi
        </h1>
        <p className="text-white/70 max-w-xl mx-auto text-base">
          Kami dengan senang hati menerima kunjungan dan pertanyaan Anda. Berikut informasi kontak dan lokasi paroki.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column — Contact Cards */}
        <div className="space-y-4 lg:col-span-1">

          {/* Address */}
          <div className="bg-white rounded-xl border border-[#DDD8D0] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FFF8E1] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#B8960C]" />
              </div>
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wider">Alamat</h3>
            </div>
            <p className="text-[#6B6560] text-sm leading-relaxed">{info.address}</p>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-xl border border-[#DDD8D0] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FFF8E1] rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-[#B8960C]" />
              </div>
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wider">Telepon</h3>
            </div>
            <a href={`tel:${info.phone}`} className="text-[#B8960C] font-bold hover:underline">
              {info.phone}
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl border border-[#DDD8D0] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FFF8E1] rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-[#B8960C]" />
              </div>
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wider">Email</h3>
            </div>
            <a href={`mailto:${info.email}`} className="text-[#B8960C] font-bold hover:underline break-all">
              {info.email}
            </a>
          </div>

          {/* Jam Operasional */}
          <div className="bg-white rounded-xl border border-[#DDD8D0] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FFF8E1] rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-[#B8960C]" />
              </div>
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wider">Jam Sekretariat</h3>
            </div>
            <div className="space-y-1">
              {operationalLines.map((line: string, i: number) => (
                <p key={i} className="text-[#6B6560] text-sm">{line}</p>
              ))}
            </div>
          </div>

          {/* Jadwal Misa */}
          <div className="bg-white rounded-xl border border-[#DDD8D0] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FFF8E1] rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-[#B8960C]" />
              </div>
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wider">Jadwal Misa</h3>
            </div>
            <div className="space-y-1">
              {massLines.map((line: string, i: number) => (
                <p key={i} className="text-[#6B6560] text-sm">{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden h-full min-h-[450px]">
            <div className="px-5 py-4 border-b border-[#EDE8DF] bg-[#FAF7F2]">
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wider">Peta Lokasi</h3>
              <p className="text-xs text-[#A89880] mt-0.5">{info.name}</p>
            </div>
            <div className="relative w-full h-full min-h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8!2d114.7853!3d-3.9992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNTknNTcuMSJTIDExNMKwNDcnMDcuMSJF!5e0!3m2!1sid!2sid!4v1"
                width="100%"
                height="100%"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Katedral Santo Yosef Martapura"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-[#3D2B1F] text-white py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
          Ingin Mendaftarkan Pernikahan?
        </h2>
        <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
          Gunakan sistem pendaftaran online kami untuk memulai proses pernikahan di Katedral Santo Yosef.
        </p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#B8960C] text-white font-bold rounded-md hover:bg-[#9A7A00] transition-colors"
        >
          Mulai Pendaftaran →
        </a>
      </div>
    </div>
  );
}
